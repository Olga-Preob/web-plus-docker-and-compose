import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UserWishesDto } from './dto/user-wishes.dto';
import { FindUsersDto } from './dto/find-users.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getOwnProfile(@Req() req) {
    return this.usersService.findOne({
      where: { id: req.user.id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
      },
    });
  }

  @Patch('me')
  updateOwnProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getOwnWishes(@Req() req) {
    const { wishes } = await this.usersService.findOne({
      where: { id: req.user.id },
      relations: {
        wishes: { owner: true, offers: true },
      },
    });

    return wishes;
  }

  @ApiParam({
    name: 'username',
    example: 'user',
  })
  @Get(':username')
  getPublicUser(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findOne({ where: { username } });
  }

  @ApiParam({
    name: 'username',
    example: 'user',
  })
  @Get(':username/wishes')
  async getPublicWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const { wishes } = await this.usersService.findOne({
      where: { username },
      relations: {
        wishes: {
          owner: false,
          offers: {
            item: { owner: true, offers: true },
            user: { wishes: true, offers: true, wishlists: true },
          },
        },
      },
    });

    return wishes;
  }

  @Post('find')
  findMany(@Body() findUsersDto: FindUsersDto) {
    const { query } = findUsersDto;

    return this.usersService.findMany(query);
  }
}
