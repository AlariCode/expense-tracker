import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserCommand } from '../user/commands/create-user.command';
import { GetUserByEmailQuery } from '../user/queries/get-user-by-email.query';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.queryBus.execute(new GetUserByEmailQuery(dto.email));
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.commandBus.execute(
      new CreateUserCommand(dto.name, dto.email, dto.password),
    );

    return {
      accessToken: this.generateToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.queryBus.execute(new GetUserByEmailQuery(dto.email));
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.generateToken(user),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  private generateToken(user: { id: number; email: string }): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}
