import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO query-параметров для GET /api/transactions/summary.
 * @property month - целое число от 1 до 12 (месяц)
 * @property year - целое число >= 2000 (год)
 */
export class GetSummaryDto {
  @ApiProperty({ example: 4, description: 'Номер месяца (1–12)', minimum: 1, maximum: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @ApiProperty({ example: 2026, description: 'Год (>= 2000)', minimum: 2000 })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year!: number;
}
