import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionHandler } from './commands/create-transaction.handler';
import { DeleteTransactionHandler } from './commands/delete-transaction.handler';
import { UpdateTransactionHandler } from './commands/update-transaction.handler';
import { GetSummaryHandler } from './queries/get-summary.handler';
import { GetTransactionByIdHandler } from './queries/get-transaction-by-id.handler';
import { GetTransactionsHandler } from './queries/get-transactions.handler';

/**
 * Модуль транзакций.
 * Подключает CQRS-инфраструктуру, регистрирует контроллер, репозиторий
 * и все command/query-хэндлеры модуля.
 */
@Module({
  imports: [CqrsModule],
  controllers: [TransactionController],
  providers: [
    TransactionRepository,
    CreateTransactionHandler,
    UpdateTransactionHandler,
    DeleteTransactionHandler,
    GetTransactionsHandler,
    GetTransactionByIdHandler,
    GetSummaryHandler,
  ],
})
export class TransactionModule {}
