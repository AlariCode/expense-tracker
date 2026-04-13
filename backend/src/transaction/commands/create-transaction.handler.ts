import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transaction } from '@prisma/client';
import { TransactionRepository } from '../transaction.repository';
import { CreateTransactionCommand } from './create-transaction.command';

/**
 * Обработчик команды CreateTransactionCommand.
 * Преобразует ISO-строку даты в Date и делегирует создание репозиторию.
 */
@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  /**
   * Выполняет создание транзакции.
   * @param command - команда с полями новой транзакции
   * @returns созданную транзакцию
   * @throws {Prisma.PrismaClientKnownRequestError} при нарушении внешних ключей (несуществующие categoryId/userId)
   */
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
