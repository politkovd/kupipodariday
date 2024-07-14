import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectConnection, InjectRepository } from "@nestjs/typeorm";
import { Like, Repository, Connection } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { hashPassword } from "../auth/hash.utils";
import { UserPublicProfileResponseDto } from "./dto/user-public-profile-response.dto";
import { Wish } from "../wishes/wish.entity";
import { UserProfileResponseDto } from "./dto/user-profile-response.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
    @InjectConnection()
    private connection: Connection
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Username or email already exists");
      }
      throw error;
    }
  }

  async findOne(query: Partial<User>): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: query,
        select: ["id", "username", "about", "avatar", "email", "password"],
      });
    } catch (error) {
      throw new NotFoundException("User not found_2");
    }
  }

  async findMany(query: string): Promise<UserPublicProfileResponseDto[]> {
    const users = await this.userRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });

    return users.map((user) => this.toPublicProfile(user));
  }

  toPublicProfile(user: User): UserPublicProfileResponseDto {
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
    };
  }

  async save(query: Partial<User>): Promise<User> {
    return this.userRepository.save(query);
  }

  async getUser(username: string): Promise<User> {
    const user = await this.findOne({ username });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findUserByName(username: string): Promise<CreateUserDto> {
    const user: CreateUserDto = await this.userRepository
      .createQueryBuilder("user")
      .where({ username })
      .addSelect(["user.email", "user.password"])
      .getOne();
    return user;
  }

  async findUserById(id: number) {
    const user: UserProfileResponseDto = await this.userRepository.findOneBy({
      id,
    });
    return user;
  }

  async updateUser(
    userId: number,
    UpdateUserDto: UpdateUserDto
  ): Promise<User> {
    const user = await this.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (UpdateUserDto.password) {
      UpdateUserDto.password = await hashPassword(UpdateUserDto.password);
    }

    Object.assign(user, UpdateUserDto);
    return this.save(user);
  }

  async findUserWishes(id: number) {
    const wishes: Wish[] = await this.wishRepository.findBy({
      owner: { id },
    });
    return wishes;
  }

  async getUserWishes(username: string) {
    const user: UserPublicProfileResponseDto =
      await this.userRepository.findOneBy({ username });
    const wishes: Wish[] = await this.wishRepository.findBy({
      owner: { id: user.id },
    });
    return wishes;
  }
}
