/**
 * CQRS-запрос финансовой сводки за месяц.
 * @property userId - ID пользователя
 * @property month - номер месяца от 1 до 12
 * @property year - год (полный, например 2026)
 */
export class GetSummaryQuery {
  constructor(
    public readonly userId: number,
    public readonly month: number,
    public readonly year: number,
  ) {}
}
