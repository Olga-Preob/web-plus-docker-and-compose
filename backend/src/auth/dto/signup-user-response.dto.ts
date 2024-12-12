import { OmitType } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class SignupUserResponseDto extends OmitType(UserDto, ['password']) {}
