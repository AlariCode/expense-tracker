import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TransactionRepository } from '../transaction.repository';
import { UpdateTransactionCommand } from './update-transaction.command';

/**
 * Обработчик команды UpdateTransactionCommand.
 * Проверяет существование транзакции и принадлежность пользователю,
 * после чего делегирует обновление репозиторию.
 */
@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  /**
   * Выполняет обновление транзакции.
   * @param command - команда с id, userId и обновляемыми полями
   * @returns обновлённую транзакцию
   * @throws {NotFoundException} если транзакция с указанным id не существует
   * @throws {ForbiddenException} если транзакция принадлежит другому пользователю
   */
  async execute(command: UpdateTransactionCommand): Promise<Transaction> {
    const { id, userId, data } = command;

    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    if (transaction.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { date, ...rest } = data;
    return this.transactionRepository.update(id, {
      ...rest,
      ...(date && { date: new Date(date) }),
    });
  }
}
