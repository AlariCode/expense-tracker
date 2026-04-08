import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TransactionRepository } from '../transaction.repository';
import { GetTransactionByIdQuery } from './get-transaction-by-id.query';

@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdHandler
  implements IQueryHandler<GetTransactionByIdQuery>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

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
