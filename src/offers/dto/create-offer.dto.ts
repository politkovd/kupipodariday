import { IsNumber, IsBoolean, IsOptional } from "class-validator";

export class CreateOfferDto {
  @IsNumber()
  wishId: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
