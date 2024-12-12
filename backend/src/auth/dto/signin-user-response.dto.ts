import { IsJWT, IsNotEmpty } from 'class-validator';

export class SigninUserResponseDto {
  @IsNotEmpty()
  @IsJWT()
  access_token: string;
}
