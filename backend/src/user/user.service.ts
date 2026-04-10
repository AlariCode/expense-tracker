import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from './queries/get-user-by-id.query';

@Injectable()
export class UserService {
  constructor(private readonly queryBus: QueryBus) {}

  async getProfile(id: number) {
    const user = await this.queryBus.execute(new GetUserByIdQuery(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { id: user.id, name: user.name, email: user.email };
  }
}
