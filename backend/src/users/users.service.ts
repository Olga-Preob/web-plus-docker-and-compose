import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const isUserTaken = await this.usersRepository.findOneBy([
      { username },
      { email },
    ]);

    if (isUserTaken) {
      throw new ConflictException(
        'User with that username or email is already registered',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });

    if (!user) {
      throw new BadRequestException('User not created');
    }

    const createdUser = await this.usersRepository.findOne({
      where: { id: user.id },
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

    return createdUser;
  }

  async findOne(query: FindOneOptions<User>) {
    const user = await this.usersRepository.findOne(query);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { username, email, password } = updateUserDto;

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isUsernameTaken = username
      ? await this.usersRepository.findOneBy({ username })
      : false;

    const isEmailTaken = email
      ? await this.usersRepository.findOneBy({ email })
      : false;

    if (
      isUsernameTaken &&
      isUsernameTaken.id !== id &&
      isEmailTaken &&
      isEmailTaken.id !== id
    ) {
      throw new ConflictException('Username and email is already taken');
    }

    if (isUsernameTaken && isUsernameTaken.id !== id) {
      throw new ConflictException('Username is already taken');
    }

    if (isEmailTaken && isEmailTaken.id !== id) {
      throw new ConflictException('Email is already taken');
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await this.usersRepository.save({
        id,
        ...updateUserDto,
        password: hashedPassword,
      });
    } else {
      await this.usersRepository.save({ id, ...updateUserDto });
    }

    const updatedUser = await this.usersRepository.findOne({
      where: { id },
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

    return updatedUser;
  }

  async removeOne(id: number, userId: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userId !== user.id) {
      throw new ForbiddenException(
        'This is not your profile, you cannot remove it',
      );
    }

    try {
      await this.usersRepository.delete(id);
    } catch (err) {
      throw new BadRequestException('User not deleted');
    }

    return user;
  }

  async findMany(query: string) {
    const users = await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
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

    return users;
  }
}
