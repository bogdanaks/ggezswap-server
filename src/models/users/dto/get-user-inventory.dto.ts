import { IsOptional, IsNumber, Max, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserInventoryQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}

export class GetUserInventoryParamDto {
  @IsString()
  steamid: string;
}
