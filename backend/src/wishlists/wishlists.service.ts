import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const { itemsId, ...rest } = createWishlistDto;

    const wishlist = this.wishlistsRepository.create({
      ...rest,
      owner: user,
    });

    if (itemsId) {
      const wishes = itemsId.map((id) => ({ id } as Wish));

      wishlist.items = wishes;
    }

    if (!wishlist) {
      throw new BadRequestException('Wishlist not created');
    }

    return this.wishlistsRepository.save(wishlist);
  }

  async findOne(query: FindOneOptions<Wishlist>) {
    const wishlist = await this.wishlistsRepository.findOne(query);

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return wishlist;
  }

  async updateOne(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You cannot update another users wishlist');
    }

    return this.wishlistsRepository.save({ ...wishlist, ...updateWishlistDto });
  }

  async removeOne(id: number, userId: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You cannot remove another users wishlist');
    }

    try {
      await this.wishlistsRepository.delete(id);
    } catch (err) {
      throw new BadRequestException('Wishlist not deleted');
    }

    return wishlist;
  }

  async findAll() {
    const wishlists = await this.wishlistsRepository.find({
      relations: { owner: true, items: true },
    });

    return wishlists;
  }
}
