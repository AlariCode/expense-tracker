import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

/**
 * DTO тела запроса для POST /api/transactions.
 * Все поля валидируются глобальным ValidationPipe (whitelist + forbidNonWhitelisted).
 * @property amount - положительное число, сумма транзакции
 * @property type - тип (INCOME | EXPENSE), обязательное
 * @property description - опциональное текстовое описание
 * @property date - дата в формате ISO-8601
 * @property categoryId - целое положительное число, ID категории
 */
export class CreateTransactionDto {
  @ApiProperty({ example: 1500.5, description: 'Сумма транзакции', minimum: 0 })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE, description: 'Тип транзакции' })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type!: TransactionType;

  @ApiPropertyOptional({ example: 'Продукты в Пятёрочке', description: 'Описание транзакции' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-04-13T10:00:00.000Z', description: 'Дата транзакции в формате ISO-8601' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ example: 1, description: 'ID категории' })
  @IsInt()
  @IsPositive()
  categoryId!: number;
}
