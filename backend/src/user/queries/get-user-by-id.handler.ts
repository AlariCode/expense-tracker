import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { UserRepository } from '../user.repository';
import { GetUserByIdQuery } from './get-user-by-id.query';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserByIdQuery): Promise<User | null> {
    return this.userRepository.findById(query.id);
  }
}
