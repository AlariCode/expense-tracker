import { TransactionType } from '@prisma/client';

export class CreateTransactionCommand {
  constructor(
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly date: string,
    public readonly categoryId: number,
    public readonly userId: number,
    public readonly description?: string,
  ) {}
}
