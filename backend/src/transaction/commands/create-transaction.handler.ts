import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transaction } from '@prisma/client';
import { TransactionRepository } from '../transaction.repository';
import { CreateTransactionCommand } from './create-transaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    const { amount, type, date, categoryId, userId, description } = command;
    return this.transactionRepository.create({
      amount,
      type,
      date: new Date(date),
      categoryId,
      userId,
      description,
    });
  }
}
