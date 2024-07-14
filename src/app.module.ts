import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm"; // Импортируйте TypeOrmModule
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./users/user.entity"; // Импортируйте ваши сущности
import { Wish } from "./wishes/wish.entity";
import { Wishlist } from "./wishlists/wishlist.entity";
import { Offer } from "./offers/offer.entity";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { WishesModule } from "./wishes/wishes.module";
import { OffersModule } from "./offers/offers.module";
import { WishlistsModule } from "./wishlists/wishlists.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres", // Тип базы данных
      host: "localhost", // Хост базы данных
      port: 5432, // Порт базы данных
      username: "postgres", // Имя пользователя
      password: "12345678", // Пароль пользователя
      database: "kupipodariday", // Имя базы данных
      entities: [User, Wish, Wishlist, Offer], // Ваши сущности
      synchronize: true, // Синхронизация схемы базы данных (для разработка)
    }),
    UsersModule, // Добавьте UsersModule
    AuthModule, // Добавьте AuthModule
    WishesModule,
    OffersModule,
    WishlistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
