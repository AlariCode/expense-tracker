import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TransactionRepository } from '../transaction.repository';
import { GetTransactionByIdQuery } from './get-transaction-by-id.query';

/**
 * Обработчик запроса GetTransactionByIdQuery.
 * Возвращает транзакцию только её владельцу.
 */
@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdHandler
  implements IQueryHandler<GetTransactionByIdQuery>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  /**
   * Получает транзакцию по id с проверкой владельца.
   * @param query - запрос с id транзакции и userId
   * @returns транзакцию
   * @throws {NotFoundException} если транзакция не найдена
   * @throws {ForbiddenException} если транзакция принадлежит другому пользователю
   */
  async execute(query: GetTransactionByIdQuery): Promise<Transaction> {
    const { id, userId } = query;

    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return transaction;
  }
}
