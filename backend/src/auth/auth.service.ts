import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.findOne({
        where: { username },
        select: {
          id: true,
          username: true,
          password: true,
        },
      });

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (user && isValidPassword) {
        return user;
      }

      return null;
    } catch (err) {
      throw new UnauthorizedException('Incorrect username or password');
    }
  }

  async signin(id: number): Promise<SigninUserResponseDto> {
    return {
      access_token: await this.jwtService.signAsync({ sub: id }),
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<SignupUserResponseDto> {
    return this.usersService.create(createUserDto);
  }
}
