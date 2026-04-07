import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; color: string; icon: string; userId: number }): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async findAllByUserId(userId: number): Promise<Category[]> {
    return this.prisma.category.findMany({ where: { userId } });
  }

  async findById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async update(id: number, data: Partial<{ name: string; color: string; icon: string }>): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
