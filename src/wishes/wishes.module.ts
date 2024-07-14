import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishesService } from "./wishes.service";
import { WishesController } from "./wishes.controller";
import { Wish } from "./wish.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Wish])],
  providers: [WishesService],
  controllers: [WishesController],
  exports: [WishesService], // Экспортируем сервис
})
export class WishesModule {}
