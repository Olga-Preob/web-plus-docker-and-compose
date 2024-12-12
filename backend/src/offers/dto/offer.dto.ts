import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

export class OfferDto {
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

  @IsNotEmpty()
  item: Wish;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsBoolean()
  hidden: boolean;

  @IsNotEmpty()
  user: User;
}
