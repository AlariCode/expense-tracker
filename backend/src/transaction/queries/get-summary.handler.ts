import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionRepository } from '../transaction.repository';
import { GetSummaryQuery } from './get-summary.query';

/**
 * Обработчик запроса GetSummaryQuery.
 * Делегирует подсчёт месячной сводки репозиторию.
 */
@QueryHandler(GetSummaryQuery)
export class GetSummaryHandler implements IQueryHandler<GetSummaryQuery> {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  /**
   * Считает суммарные доходы, расходы и баланс пользователя за месяц.
   * @param query - запрос с userId, month, year
   * @returns объект `{ totalIncome, totalExpense, balance }`
   */
  async execute(query: GetSummaryQuery) {
    const { userId, month, year } = query;
    return this.transactionRepository.getSummary(userId, month, year);
  }
}
