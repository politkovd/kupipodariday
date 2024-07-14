import {
  IsString,
  IsUrl,
  IsDecimal,
  IsOptional,
  Length,
} from "class-validator";

export class UpdateWishDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsDecimal()
  price?: number;

  @IsOptional()
  @IsDecimal()
  raised?: number;

  @IsOptional()
  @IsString()
  @Length(1, 1024)
  description?: string;

  @IsOptional()
  @IsDecimal()
  copied?: number;
}
