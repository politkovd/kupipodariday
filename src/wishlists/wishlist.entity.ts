import { IsString, Length, IsUrl } from "class-validator";
import { User } from "src/users/user.entity";
import { Wish } from "src/wishes/wish.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: "varchar",
    length: 250,
  })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({
    type: "varchar",
    length: 1500,
    default: "",
  })
  @IsString()
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, { cascade: true })
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  @JoinColumn({ name: "ownerId" }) // Обязательно добавить JoinColumn
  owner: User;
}
