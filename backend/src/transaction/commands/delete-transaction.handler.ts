import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TransactionRepository } from '../transaction.repository';
import { DeleteTransactionCommand } from './delete-transaction.command';

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler
  implements ICommandHandler<DeleteTransactionCommand>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(command: DeleteTransactionCommand): Promise<Transaction> {
    const { id, userId } = command;

    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.transactionRepository.delete(id);
  }
}
