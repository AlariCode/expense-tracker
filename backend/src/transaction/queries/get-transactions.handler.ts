import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Transaction } from '@prisma/client';
import { TransactionRepository } from '../transaction.repository';
import { GetTransactionsQuery } from './get-transactions.query';

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsHandler
  implements IQueryHandler<GetTransactionsQuery>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(query: GetTransactionsQuery): Promise<Transaction[]> {
    const { userId, filters } = query;
    return this.transactionRepository.findAllByUserId(userId, {
      dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
      type: filters.type,
      categoryId: filters.categoryId,
    });
  }
}
