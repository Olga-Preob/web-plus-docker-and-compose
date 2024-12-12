import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @ApiPropertyOptional({ example: 'Мой вишлист' })
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiPropertyOptional({ example: 'https://i.pravatar.cc/150?img=3' })
  @IsOptional()
  @IsUrl()
  image: string;

  @ApiPropertyOptional({ example: [1] })
  @IsOptional()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
