import { Controller, Post, UseGuards, Request, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post("signup")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
