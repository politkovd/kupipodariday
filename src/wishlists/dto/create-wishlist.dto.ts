import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateWishlistDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString() // Исправлено на IsString, если это текстовое поле
  image: string;

  @IsOptional()
  @IsString() // Исправлено на IsString
  description: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
