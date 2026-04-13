import { TransactionType } from '@prisma/client';

/**
 * CQRS-запрос списка транзакций пользователя с фильтрацией.
 * @property userId - ID пользователя
 * @property filters - фильтры: dateFrom/dateTo (ISO-строки), type, categoryId
 */
export class GetTransactionsQuery {
  constructor(
    public readonly userId: number,
    public readonly filters: {
      dateFrom?: string;
      dateTo?: string;
      type?: TransactionType;
      categoryId?: number;
    },
  ) {}
}
