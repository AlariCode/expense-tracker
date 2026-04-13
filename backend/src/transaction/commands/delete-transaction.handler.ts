import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TransactionRepository } from '../transaction.repository';
import { DeleteTransactionCommand } from './delete-transaction.command';

/**
 * Обработчик команды DeleteTransactionCommand.
 * Проверяет существование транзакции и принадлежность пользователю перед удалением.
 */
@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler
  implements ICommandHandler<DeleteTransactionCommand>
{
  constructor(private readonly transactionRepository: TransactionRepository) {}

  /**
   * Выполняет удаление транзакции.
   * @param command - команда с id транзакции и userId инициатора
   * @returns удалённую транзакцию
   * @throws {NotFoundException} если транзакция не найдена
   * @throws {ForbiddenException} если транзакция принадлежит другому пользователю
   */
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
