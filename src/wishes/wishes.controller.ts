import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
} from "@nestjs/common";
import { WishesService } from "./wishes.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { Request as ExpressRequest } from "express";
import { Wish } from "./wish.entity";

@Controller("wishes")
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: ExpressRequest) {
    return this.wishesService.create(createWishDto, req.user.userId);
  }

  @Get("top")
  async findTop(): Promise<Wish[]> {
    return await this.wishesService.findTop();
  }

  @Get("last")
  async findLast(): Promise<Wish[]> {
    return await this.wishesService.findLast();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.wishesService.getWish(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async updateWish(
    @Req() req: ExpressRequest,
    @Param("id") id: number,
    @Body() updateWishDto: UpdateWishDto
  ): Promise<Wish> {
    return await this.wishesService.updateWish(
      req.user.userId,
      id,
      updateWishDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async removeWish(
    @Req() req: ExpressRequest,
    @Param("id") id: number
  ): Promise<Wish> {
    return await this.wishesService.remove(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/copy")
  async copyWish(
    @Req() req: ExpressRequest,
    @Param("id") id: number
  ): Promise<Record<string, never>> {
    await this.wishesService.copyWish(req.user.userId, id);
    return {};
  }
}
