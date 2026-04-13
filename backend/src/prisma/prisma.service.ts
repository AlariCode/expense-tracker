import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Сервис-обёртка над PrismaClient.
 * Регистрируется как провайдер в NestJS DI и используется репозиториями
 * как единая точка доступа к БД.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Хук жизненного цикла NestJS: устанавливает соединение с БД при старте модуля.
   * @returns промис, резолвящийся после успешного подключения
   * @throws {PrismaClientInitializationError} при невозможности подключиться к БД
   */
  async onModuleInit() {
    await this.$connect();
  }
}
