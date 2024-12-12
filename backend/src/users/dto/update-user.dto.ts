import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'username',
  'email',
  'password',
]) {
  @ApiPropertyOptional({ example: 'user' })
  @IsOptional()
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiPropertyOptional({ example: 'user@yandex.ru' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'somestrongpassword' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  password: string;
}
