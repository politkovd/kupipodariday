import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from "typeorm";
import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
import { Exclude } from "class-transformer";
import { Wish } from "src/wishes/wish.entity";
import { Offer } from "src/offers/offer.entity";
import { Wishlist } from "src/wishlists/wishlist.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: "varchar",
    length: 30,
    unique: true,
  })
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @Column({
    type: "varchar",
    length: 200,
    default: "Пока ничего не рассказал о себе",
  })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({
    type: "varchar",
    default: "https://i.pravatar.cc/300",
  })
  @IsUrl()
  avatar: string;

  @Column({
    type: "varchar",
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({
    type: "varchar",
    select: false,
  })
  @IsString()
  @IsNotEmpty()
  @Exclude()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
