import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<Omit<User, 'password'>> {
    const { name, email, password } = command;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({ name, email, password: hashedPassword });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
