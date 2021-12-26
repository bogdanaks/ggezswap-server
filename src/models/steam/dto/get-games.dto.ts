import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class GetGamesDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  appId?: string;
}
