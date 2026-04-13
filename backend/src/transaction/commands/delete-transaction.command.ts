/**
 * CQRS-команда удаления транзакции.
 * @property id - UUID удаляемой транзакции
 * @property userId - ID пользователя, выполняющего удаление (для проверки владельца)
 */
export class DeleteTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly userId: number,
  ) {}
}
