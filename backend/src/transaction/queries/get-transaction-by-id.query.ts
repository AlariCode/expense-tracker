/**
 * CQRS-запрос получения транзакции по UUID.
 * @property id - UUID транзакции
 * @property userId - ID пользователя для проверки владельца
 */
export class GetTransactionByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: number,
  ) {}
}
