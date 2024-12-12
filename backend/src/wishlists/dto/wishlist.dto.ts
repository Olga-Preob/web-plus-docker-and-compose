import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

export class WishlistDto {
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

  @ApiProperty({ example: 'Мой вишлист' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1500)
  description: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/150?img=3' })
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  owner: User;

  @IsNotEmpty()
  items: Wish[];
}
