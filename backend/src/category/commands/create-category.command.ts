export class CreateCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly color: string,
    public readonly icon: string,
    public readonly userId: number,
  ) {}
}
