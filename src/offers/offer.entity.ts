import { User } from "src/users/user.entity";
import { Wish } from "src/wishes/wish.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
