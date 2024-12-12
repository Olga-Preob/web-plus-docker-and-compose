import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';

export class WishDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ example: 'Маленький кот' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({ example: 'https://kupi.kota.ru' })
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @ApiProperty({ example: 5000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  raised: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  copied: number;

  @ApiProperty({ example: 'Купи кота' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  description: string;

  @IsNotEmpty()
  owner: User;

  @IsNotEmpty()
  offers: Offer[];
}
