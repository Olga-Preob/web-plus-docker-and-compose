import { PickType } from '@nestjs/swagger';
import { WishDto } from './wish.dto';

export class CreateWishDto extends PickType(WishDto, [
  'name',
  'link',
  'image',
  'price',
  'description',
]) {}
