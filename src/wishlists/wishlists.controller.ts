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
import { WishlistsService } from "./wishlists.service";
import { Wishlist } from "./wishlist.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { Request as ExpressRequest } from "express";
import { CreateWishlistDto } from "src/wishlists/dto/create-wishlist.dto";
import { UpdateWishDto } from "src/wishes/dto/update-wish.dto";
import { Wish } from "src/wishes/wish.entity";

interface FormattedWishlist extends Omit<Wishlist, "items"> {
  items: Array<Omit<Wish, "owner"> & { owner: string }>;
}

@Controller("wishlists")
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findWishlists(@Req() req: ExpressRequest): Promise<Wishlist[]> {
    return await this.wishlistsService.findWishlists(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: ExpressRequest
  ) {
    return this.wishlistsService.createWishlist(
      req.user.userId,
      createWishlistDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getWishlist(
    @Req() req: ExpressRequest,
    @Param("id") id: number
  ): Promise<FormattedWishlist> {
    return await this.wishlistsService.getWishlist(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async updateWishlist(
    @Req() req: ExpressRequest,
    @Param("id") id: number,
    @Body() updateWishDto: UpdateWishDto
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateWishlist(
      req.user.userId,
      id,
      updateWishDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async removeWishlist(
    @Req() req: ExpressRequest,
    @Param("id") id: number
  ): Promise<FormattedWishlist> {
    return await this.wishlistsService.removeWishlist(req.user.userId, id);
  }
}
