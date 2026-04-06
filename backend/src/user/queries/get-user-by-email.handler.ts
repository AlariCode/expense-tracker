import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import { UserRepository } from '../user.repository';
import { GetUserByEmailQuery } from './get-user-by-email.query';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserByEmailQuery): Promise<User | null> {
    return this.userRepository.findByEmail(query.email);
  }
}
