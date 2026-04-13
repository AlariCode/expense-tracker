import { TransactionType } from '@prisma/client';

/**
 * CQRS-команда обновления транзакции.
 * @property id - UUID обновляемой транзакции
 * @property userId - ID пользователя, выполняющего обновление (для проверки владельца)
 * @property data - частичный набор полей для обновления
 */
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
