import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';

export class GetTransactionsDto {
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  categoryId?: number;
}
