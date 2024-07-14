import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { OffersService } from "./offers.service";
import { Offer } from "./offer.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CreateOfferDto } from "src/offers/dto/create-offer.dto";
import { Request } from "express";

@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: Request) {
    return this.offersService.createOffer(createOfferDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: number): Promise<Offer> {
    return this.offersService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findMany(@Query() query: Partial<Offer>): Promise<Offer[]> {
    return this.offersService.findMany(query);
  }
}
