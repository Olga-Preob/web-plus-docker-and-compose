import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { OfferDto } from './offer.dto';

export class CreateOfferDto extends PickType(OfferDto, ['amount']) {
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @ApiProperty({ example: 0 })
  @IsNotEmpty()
  @IsNumber()
  itemId: number;
}
