import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { Wishlist } from "./wishlist.entity";
import { Wish } from "src/wishes//wish.entity";
import { User } from "src/users/user.entity";

interface FormattedWishlist extends Omit<Wishlist, "items"> {
  items: Array<Omit<Wish, "owner"> & { owner: string }>;
}

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish) private wishRepository: Repository<Wish>
  ) {}

  async findWishlists(userid: number) {
    return await this.wishlistRepository
      .createQueryBuilder("wishlist")
      .leftJoinAndSelect("wishlist.owner", "owner")
      .where("owner.id = :userId", { userId: userid })
      .getMany();
  }

  async createWishlist(userId: number, createWishlistDto: CreateWishlistDto) {
    const { name, image, itemsId, description } = createWishlistDto;
    const wishes = await this.wishRepository.findBy({ id: In(itemsId) });
    return await this.wishlistRepository.save({
      name,
      image,
      description,
      owner: { id: userId } as User, // Сделаем объект User с нужным id
      items: wishes,
    });
  }

  async getWishlist(id: number): Promise<FormattedWishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ["owner", "items", "items.owner"],
    });

    if (!wishlist) {
      throw new NotFoundException("Wishlist not found");
    }

    const { items, ...partialWishlist } = wishlist;

    const formattedItems = items.map((item) => {
      const { owner, ...rest } = item;
      return { ...rest, owner: owner.username };
    });

    return { ...partialWishlist, items: formattedItems } as FormattedWishlist;
  }

  async updateWishlist(
    userid: number,
    id: number,
    updateWishlistDto: UpdateWishlistDto
  ) {
    const { itemsId, ...wishlist } = updateWishlistDto;

    if (itemsId) {
      const wishes = await this.wishRepository.findBy({
        id: In(itemsId),
      });
      wishlist["items"] = wishes;
    }

    const updateResult = await this.wishlistRepository
      .createQueryBuilder()
      .update()
      .set(wishlist)
      .where("id = :id", { id })
      .andWhere("owner.id = :ownerId", { ownerId: userid })
      .execute();

    if (updateResult.affected === 0) {
      throw new BadRequestException("This wishlist does not exist");
    }

    return this.wishlistRepository.findOneBy({ id });
  }

  async removeWishlist(userid: number, id: number): Promise<FormattedWishlist> {
    const wishlist = await this.getWishlist(id);

    if (!wishlist || wishlist.owner.id !== userid) {
      throw new BadRequestException("This wishlist does not exist");
    }

    await this.wishlistRepository
      .createQueryBuilder()
      .delete()
      .where("id = :id", { id })
      .andWhere("owner.id = :ownerId", { ownerId: userid })
      .execute();

    return wishlist;
  }
}
