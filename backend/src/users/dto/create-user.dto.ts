import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto extends PickType(UserDto, [
  'username',
  'email',
  'password',
]) {
  @ApiPropertyOptional({ example: 'Пока ничего не рассказал о себе' })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @ApiPropertyOptional({ example: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsUrl()
  avatar: string;
}
