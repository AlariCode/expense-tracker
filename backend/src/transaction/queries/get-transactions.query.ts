import { TransactionType } from '@prisma/client';

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
