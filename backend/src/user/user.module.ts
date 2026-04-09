import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './commands/create-user.handler';
import { GetUserByEmailHandler } from './queries/get-user-by-email.handler';
import { GetUserByIdHandler } from './queries/get-user-by-id.handler';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [UserRepository, UserService, CreateUserHandler, GetUserByEmailHandler, GetUserByIdHandler],
  exports: [CqrsModule],
})
export class UserModule {}
