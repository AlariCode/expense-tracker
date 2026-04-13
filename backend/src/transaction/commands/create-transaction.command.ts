import { TransactionType } from '@prisma/client';

/**
 * CQRS-команда создания транзакции.
 * @property amount - сумма транзакции (положительное число)
 * @property type - тип транзакции (INCOME | EXPENSE)
 * @property date - дата в формате ISO-строки
 * @property categoryId - ID категории
 * @property userId - ID пользователя-владельца
 * @property description - опциональное описание
 */
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
