import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Транспорт', description: 'Название категории' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '#33A1FF', description: 'HEX-цвет категории' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ example: 'car', description: 'Иконка категории' })
  @IsString()
  @IsOptional()
  icon?: string;
}
