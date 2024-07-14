import {
  IsString,
  IsUrl,
  IsDecimal,
  IsOptional,
  Length,
} from "class-validator";

export class CreateWishDto {
  @IsString()
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsDecimal()
  price: number;

  @IsOptional() // Потому что это поле может быть не установлено при создании
  @IsDecimal()
  raised?: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
