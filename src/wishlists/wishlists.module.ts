import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishlistsService } from "./wishlists.service";
import { WishlistsController } from "./wishlists.controller";
import { Wishlist } from "./wishlist.entity";
import { Wish } from "src/wishes/wish.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Wish])],
  providers: [WishlistsService],
  controllers: [WishlistsController],
  exports: [WishlistsService], // Экспортируем сервис
})
export class WishlistsModule {}
