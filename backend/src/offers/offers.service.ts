import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const { amount, itemId } = createOfferDto;

    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: { owner: true, offers: true },
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException('You cannot create offer for your own wish');
    }

    const newRaised = Number(wish.raised) + Number(amount);

    if (newRaised > Number(wish.price)) {
      throw new ForbiddenException(
        'Total amount raised cannot exceed the price of the wish',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const offer = queryRunner.manager.create(Offer, {
        ...createOfferDto,
        item: wish,
        user,
      });

      await queryRunner.manager.update(Wish, itemId, {
        raised: newRaised,
      });

      await queryRunner.manager.save(Offer, offer);

      await queryRunner.commitTransaction();

      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new BadRequestException('Offer not created');
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(query: FindOneOptions<Offer>) {
    const offer = await this.offersRepository.findOne(query);

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }

  async findAll() {
    const offers = await this.offersRepository.find({
      relations: {
        item: { offers: true, owner: true },
        user: {
          offers: { item: true },
          wishes: { offers: true, owner: true },
          wishlists: true,
        },
      },
    });

    return offers;
  }
}
