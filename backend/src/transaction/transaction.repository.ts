import { Injectable } from '@nestjs/common';
import { Transaction, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

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

  async delete(id: string): Promise<Transaction> {
    return this.prisma.transaction.delete({ where: { id } });
  }

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
