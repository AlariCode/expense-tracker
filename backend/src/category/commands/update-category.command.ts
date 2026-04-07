export class UpdateCategoryCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly data: Partial<{ name: string; color: string; icon: string }>,
  ) {}
}
