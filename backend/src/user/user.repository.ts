import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Найти пользователя по email.
	 * @param email - адрес электронной почты
	 * @returns пользователь или `null`, если не найден
	 */
	async findByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { email } });
	}

	/**
	 * Найти пользователя по идентификатору.
	 * @param id - числовой ID пользователя
	 * @returns пользователь или `null`, если не найден
	 */
	async findById(id: number): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { id } });
	}

	/**
	 * Создать нового пользователя.
	 * @param data - имя, email и хэшированный пароль
	 * @returns созданный пользователь
	 */
	async create(data: { name: string; email: string; password: string }): Promise<User> {
		return this.prisma.user.create({ data });
	}
}
