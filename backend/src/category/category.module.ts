import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CreateCategoryHandler } from './commands/create-category.handler';
import { DeleteCategoryHandler } from './commands/delete-category.handler';
import { UpdateCategoryHandler } from './commands/update-category.handler';
import { GetCategoriesByUserHandler } from './queries/get-categories-by-user.handler';

@Module({
  imports: [CqrsModule],
  controllers: [CategoryController],
  providers: [
    CategoryRepository,
    CreateCategoryHandler,
    UpdateCategoryHandler,
    DeleteCategoryHandler,
    GetCategoriesByUserHandler,
  ],
})
export class CategoryModule {}
