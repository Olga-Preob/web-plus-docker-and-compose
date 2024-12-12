import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@ApiTags('offers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @HttpCode(201)
  create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(req.user, createOfferDto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne({
      where: { id: +id },
      relations: {
        item: { offers: true, owner: true },
        user: { offers: true, wishes: true, wishlists: true },
      },
    });
  }
}
