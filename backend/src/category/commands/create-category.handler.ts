import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Category } from '@prisma/client';
import { CategoryRepository } from '../category.repository';
import { CreateCategoryCommand } from './create-category.command';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: CreateCategoryCommand): Promise<Category> {
    const { name, color, icon, userId } = command;
    return this.categoryRepository.create({ name, color, icon, userId });
  }
}
