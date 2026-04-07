export class DeleteCategoryCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
