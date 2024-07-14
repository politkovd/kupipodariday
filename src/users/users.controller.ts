import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FindUsersDto } from "./dto/find-users.dto";
import { Request as ExpressRequest } from "express";
import { UserPublicProfileResponseDto } from "./dto/user-public-profile-response.dto";

@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  findOne(@Req() req: ExpressRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateOne(
    @Req() req: ExpressRequest,
    @Body() updateProfileDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.updateUser(req.user.userId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me/wishes")
  getMyWishes(@Req() req: ExpressRequest) {
    return this.usersService.findUserWishes(req.user.userId);
  }

  @Get(":username")
  getUserByUsername(@Param("username") username: string) {
    return this.usersService.getUser(username);
  }

  @Get(":username/wishes")
  async getWishesByUsername(@Param("username") username: string) {
    return this.usersService.getUserWishes(username);
  }

  @Post("find")
  async searchUsers(
    @Body() findUsersDto: FindUsersDto
  ): Promise<UserPublicProfileResponseDto[]> {
    return await this.usersService.findMany(findUsersDto.query);
  }
}
