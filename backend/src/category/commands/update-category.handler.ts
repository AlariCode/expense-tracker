import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoryRepository } from '../category.repository';
import { UpdateCategoryCommand } from './update-category.command';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: UpdateCategoryCommand): Promise<Category> {
    const { id, userId, data } = command;
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (category.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.categoryRepository.update(id, data);
  }
}
