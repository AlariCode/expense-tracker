import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Category } from '@prisma/client';
import { CategoryRepository } from '../category.repository';
import { GetCategoriesByUserQuery } from './get-categories-by-user.query';

@QueryHandler(GetCategoriesByUserQuery)
export class GetCategoriesByUserHandler implements IQueryHandler<GetCategoriesByUserQuery> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: GetCategoriesByUserQuery): Promise<Category[]> {
    return this.categoryRepository.findAllByUserId(query.userId);
  }
}
