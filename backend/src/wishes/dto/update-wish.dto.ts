import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class UpdateWishDto {
  @ApiPropertyOptional({ example: 'Большая пони' })
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiPropertyOptional({ example: 'https://kupi.poni.ru' })
  @IsOptional()
  @IsUrl()
  link: string;

  @ApiPropertyOptional({ example: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsUrl()
  image: string;

  @ApiPropertyOptional({ example: 8000 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiPropertyOptional({ example: 'Купи пони' })
  @IsOptional()
  @IsString()
  @Length(1, 1024)
  description: string;
}
