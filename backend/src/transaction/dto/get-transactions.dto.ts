import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

/**
 * DTO query-параметров для GET /api/transactions.
 * Все поля опциональны — комбинируются как условия фильтра.
 * @property dateFrom - нижняя граница периода (ISO-8601)
 * @property dateTo - верхняя граница периода (ISO-8601)
 * @property type - тип транзакции (INCOME | EXPENSE)
 * @property categoryId - ID категории, число (приводится из query-string)
 */
export class GetTransactionsDto {
  @ApiPropertyOptional({ example: '2026-04-01T00:00:00.000Z', description: 'Нижняя граница периода (ISO-8601)' })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-04-30T23:59:59.000Z', description: 'Верхняя граница периода (ISO-8601)' })
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @ApiPropertyOptional({ enum: TransactionType, description: 'Фильтр по типу транзакции' })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @ApiPropertyOptional({ example: 1, description: 'Фильтр по ID категории' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  categoryId?: number;
}
