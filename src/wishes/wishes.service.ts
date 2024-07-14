import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Wish } from "./wish.entity";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { User } from "src/users/user.entity";

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>
  ) {}

  async findLast() {
    const wishes: Wish[] = await this.wishesRepository.find({
      order: { createdAt: "DESC" },
      take: 40,
    });
    return wishes;
  }

  async findTop() {
    const wishes: Wish[] = await this.wishesRepository.find({
      order: { copied: "DESC" },
      take: 20,
    });
    return wishes;
  }

  findOne(query: Partial<Wish>): Promise<Wish> {
    return this.wishesRepository.findOneOrFail({ where: query });
  }

  async create(createWishDto: CreateWishDto, userId: number): Promise<Wish> {
    console.log("Зашли в POST по созданию Wish");
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: userId } as User, // Создаем объект User с нужным ID
    });
    return this.wishesRepository.save(wish);
  }

  async updateWish(
    userid: number,
    id: number,
    updateWishDto: UpdateWishDto
  ): Promise<Wish> {
    const { affected } = await this.wishesRepository.update(
      { owner: { id: userid }, id, raised: 0 },
      updateWishDto
    );

    if (!affected) {
      throw new BadRequestException("This is not your wish");
    }

    return this.findOne({ id });
  }

  async copyWish(userid: number, WishId: number) {
    const { id, name, link, image, price, description } =
      await this.wishesRepository.findOne({
        where: { id: WishId },
        relations: { owner: true },
      });

    const createWishDto: CreateWishDto = {
      name,
      link,
      image,
      price,
      description,
    };

    await this.create(createWishDto, userid);

    await this.wishesRepository.increment({ id }, "copied", 1);
  }

  async getWish(id: number) {
    const wish: Wish = await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });

    if (!wish) {
      throw new NotFoundException("There is no such wish");
    }

    const { offers, ...partialWish } = wish;

    const offerRes = offers.map((offer) => {
      const { user, ...rest } = offer;
      return { ...rest, user: user.username };
    });

    return { ...partialWish, offers: offerRes };
  }

  async remove(userid: number, id: number) {
    const deletedWish = await this.wishesRepository.findOne({
      where: { owner: { id: userid }, id, raised: 0 },
    });

    if (!deletedWish) {
      throw new BadRequestException(
        "Wish not found or you are trying to delete a wish that is not yours"
      );
    }

    await this.wishesRepository.delete({ owner: { id: userid }, id });

    return deletedWish;
  }
}
