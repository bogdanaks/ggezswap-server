import { IsString } from "class-validator";

export class TradeSellDto {
  @IsString({ each: true })
  items: string[];
}
