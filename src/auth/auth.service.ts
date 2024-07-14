import { ConflictException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { comparePassword, hashPassword } from "./hash.utils";
import { User } from "src/users/user.entity";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      console.log("User not found");
      return null;
    }

    const passwordMatches = await comparePassword(
      pass,
      String(user.password).trim()
    );
    console.log(`Password matches: ${passwordMatches}`);
    if (passwordMatches) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    console.log("Invalid credentials");
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await hashPassword(createUserDto.password);
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error.code === "23505") {
        // PostgreSQL error code for unique violation
        throw new ConflictException("Username or email already exists");
      }
      throw error;
    }
  }
}
