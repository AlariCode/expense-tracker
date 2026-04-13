import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

/**
 * DTO тела запроса для PATCH /api/transactions/:id.
 * Все поля опциональные — обновляются только переданные.
 * @property amount - положительное число, сумма
 * @property type - тип транзакции (INCOME | EXPENSE)
 * @property description - текстовое описание
 * @property date - дата в формате ISO-8601
 * @property categoryId - целое положительное число, ID категории
 */
export class UpdateTransactionDto {
  @ApiPropertyOptional({ example: 1500.5, description: 'Сумма транзакции', minimum: 0 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ enum: TransactionType, example: TransactionType.EXPENSE, description: 'Тип транзакции' })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @ApiPropertyOptional({ example: 'Продукты', description: 'Описание транзакции' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '2026-04-13T10:00:00.000Z', description: 'Дата транзакции в формате ISO-8601' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID категории' })
  @IsInt()
  @IsPositive()
  @IsOptional()
  categoryId?: number;
}
