import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 5 })
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

  @ApiProperty({ example: 'user' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiProperty({ example: 'Пока ничего не рассказал о себе' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 200)
  about: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  @IsNotEmpty()
  @IsUrl()
  avatar: string;

  @ApiProperty({ example: 'user@yandex.ru' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'somestrongpassword' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  password: string;
}
