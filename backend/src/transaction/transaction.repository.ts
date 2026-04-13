import { Injectable } from '@nestjs/common';
import { Transaction, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Репозиторий для работы с транзакциями через Prisma.
 * Единственная точка доступа к таблице Transaction в БД.
 */
@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создаёт новую запись транзакции в БД.
   * @param data - поля транзакции, включая userId владельца
   * @returns созданную транзакцию
   * @throws {Prisma.PrismaClientKnownRequestError} при нарушении FK (например, несуществующий categoryId/userId)
   */
  async create(data: {
    amount: number;
    type: TransactionType;
    description?: string;
    date: Date;
    categoryId: number;
    userId: number;
  }): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  /**
   * Возвращает все транзакции пользователя с опциональной фильтрацией по периоду, типу и категории.
   * @param userId - ID пользователя-владельца
   * @param filters - набор опциональных фильтров: dateFrom, dateTo, type, categoryId
   * @returns массив транзакций с подгруженной категорией, отсортированный по дате (desc)
   */
  async findAllByUserId(
    userId: number,
    filters: {
      dateFrom?: Date;
      dateTo?: Date;
      type?: TransactionType;
      categoryId?: number;
    },
  ): Promise<Transaction[]> {
    const where: Record<string, unknown> = { userId };

    if (filters.dateFrom || filters.dateTo) {
      where.date = {
        ...(filters.dateFrom && { gte: filters.dateFrom }),
        ...(filters.dateTo && { lte: filters.dateTo }),
      };
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    return this.prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Находит транзакцию по UUID без проверки владельца.
   * @param id - UUID транзакции
   * @returns транзакцию или null, если запись не найдена
   */
  async findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  /**
   * Обновляет транзакцию по UUID указанным набором полей.
   * @param id - UUID транзакции
   * @param data - частичный набор обновляемых полей
   * @returns обновлённую транзакцию
   * @throws {Prisma.PrismaClientKnownRequestError} (P2025) если запись с таким id не существует
   */
  async update(
    id: string,
    data: Partial<{
      amount: number;
      type: TransactionType;
      description: string;
      date: Date;
      categoryId: number;
    }>,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({ where: { id }, data });
  }

  /**
   * Удаляет транзакцию по UUID.
   * @param id - UUID транзакции
   * @returns удалённую запись
   * @throws {Prisma.PrismaClientKnownRequestError} (P2025) если запись не найдена
   */
  async delete(id: string): Promise<Transaction> {
    return this.prisma.transaction.delete({ where: { id } });
  }

  /**
   * Считает агрегированную сводку (доходы, расходы, баланс) за календарный месяц.
   * @param userId - ID пользователя
   * @param month - номер месяца от 1 до 12
   * @param year - год (полный, например 2026)
   * @returns объект `{ totalIncome, totalExpense, balance }` в виде чисел
   */
  async getSummary(userId: number, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        date: { gte: startDate, lt: endDate },
      },
      _sum: { amount: true },
    });

    const totalIncome =
      result.find((r) => r.type === 'INCOME')?._sum.amount?.toNumber() ?? 0;
    const totalExpense =
      result.find((r) => r.type === 'EXPENSE')?._sum.amount?.toNumber() ?? 0;

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }
}
