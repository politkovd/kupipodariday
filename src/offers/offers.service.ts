import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Offer } from "./offer.entity";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { User } from "../users/user.entity";
import { Wish } from "../wishes/wish.entity";

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>
  ) {}

  async createOffer(
    createOfferDto: CreateOfferDto,
    userId: number
  ): Promise<Offer> {
    const { wishId, amount, hidden } = createOfferDto;

    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ["owner"],
    });
    if (!wish) {
      throw new BadRequestException("Wish not found");
    }
    //console.log("wish.owner.id - " + wish.owner.id);
    console.log("userId - " + userId);

    if (wish.owner.id === userId) {
      throw new ForbiddenException("You cannot donate to your own wish");
    }

    if (wish.price - wish.raised < amount) {
      throw new BadRequestException("Donation exceeds the required amount");
    }

    wish.raised += amount;
    await this.wishesRepository.save(wish);

    const offer = this.offersRepository.create({
      item: wish,
      amount,
      hidden: hidden ?? false,
      user: { id: userId } as User,
    });
    return this.offersRepository.save(offer);
  }

  async findOne(query: Partial<Offer>): Promise<Offer> {
    try {
      return await this.offersRepository.findOneOrFail({ where: query });
    } catch (error) {
      throw new NotFoundException("Offer not found");
    }
  }

  async findMany(query: Partial<Offer>): Promise<Offer[]> {
    return await this.offersRepository.find({
      where: { ...query, hidden: false },
    });
  }
}
