export class GetTransactionByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: number,
  ) {}
}
