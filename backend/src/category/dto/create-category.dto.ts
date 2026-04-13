import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Продукты', description: 'Название категории' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '#FF5733', description: 'HEX-цвет категории' })
  @IsString()
  @IsNotEmpty()
  color!: string;

  @ApiProperty({ example: 'shopping-cart', description: 'Иконка категории' })
  @IsString()
  @IsNotEmpty()
  icon!: string;
}
