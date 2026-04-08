import { TransactionType } from '@prisma/client';

export class UpdateTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly userId: number,
    public readonly data: Partial<{
      amount: number;
      type: TransactionType;
      description: string;
      date: string;
      categoryId: number;
    }>,
  ) {}
}
