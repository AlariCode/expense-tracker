import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionRepository } from '../transaction.repository';
import { GetSummaryQuery } from './get-summary.query';

@QueryHandler(GetSummaryQuery)
export class GetSummaryHandler implements IQueryHandler<GetSummaryQuery> {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(query: GetSummaryQuery) {
    const { userId, month, year } = query;
    return this.transactionRepository.getSummary(userId, month, year);
  }
}
