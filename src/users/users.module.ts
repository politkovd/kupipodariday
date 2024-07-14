import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { Wish } from "../wishes/wish.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Экспортируем сервис
})
export class UsersModule {}
