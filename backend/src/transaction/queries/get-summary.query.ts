export class GetSummaryQuery {
  constructor(
    public readonly userId: number,
    public readonly month: number,
    public readonly year: number,
  ) {}
}
