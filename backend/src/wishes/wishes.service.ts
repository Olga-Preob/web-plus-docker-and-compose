import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    });

    if (!wish) {
      throw new BadRequestException('Wish not created');
    }

    return wish;
  }

  async findOne(query: FindOneOptions<Wish>) {
    const wish = await this.wishesRepository.findOne(query);

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    return wish;
  }

  async updateOne(
    id: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('You cannot update another users wish');
    }

    if (wish.offers.length > 0) {
      throw new ForbiddenException(
        'You cannot update a wish with active offers',
      );
    }

    return this.wishesRepository.save({ ...wish, ...updateWishDto });
  }

  async removeOne(id: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('You cannot remove another users wish');
    }

    if (wish.offers.length > 0) {
      throw new ForbiddenException(
        'You cannot remove a wish with active offers',
      );
    }

    try {
      await this.wishesRepository.delete(id);
    } catch (err) {
      throw new BadRequestException('Wish not deleted');
    }

    return wish;
  }

  async findLast() {
    return this.wishesRepository.find({
      relations: {
        owner: true,
        offers: { item: true },
      },
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTop() {
    return this.wishesRepository.find({
      relations: {
        owner: true,
        offers: { item: true },
      },
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async copy(id: number, user: User) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    const copyCounter = wish.copied + 1;

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException('You cannot copy your own wish');
    }

    const hasCopied = await this.wishesRepository.findOneBy({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      owner: { id: user.id },
    });

    if (hasCopied) {
      throw new ForbiddenException('You already have a copy of this wish');
    }

    try {
      await this.create(user, {
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        description: wish.description,
      });

      await this.wishesRepository.update(id, { copied: copyCounter });
    } catch (err) {
      throw new BadRequestException('Wish copy not created');
    }

    return wish;
  }
}
