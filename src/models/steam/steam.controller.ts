import { Body, Controller, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { SteamService } from './steam.service';
import { ResponseInterceptor } from "interceptors/response.interceptor";
import { BotInventoryItem } from "../../common/interfaces/inventory-response";
import { TradeSellDto } from "./dto/trade-sell.dto";
import { Games } from "models/steam/entities/game.entity";
import { GetGamesDto } from "models/steam/dto/get-games.dto";

@UseInterceptors(ResponseInterceptor)
@Controller()
export class SteamController {
  constructor(private readonly steamService: SteamService) {}

  @Get('steam/inventory/:appId') // only inner API, maybe delete it
  async getSteamInventory(@Param() param?: GetGamesDto): Promise<BotInventoryItem[]> {
    return await this.steamService.getInventory()
  }

  @Post('steam/trade/sell')
  async tradeSell(@Body() body: TradeSellDto): Promise<string> {
    await this.steamService.tradeSell(body.items)
    return 'ok'
  }

  @Post('steam/trade/buy')
  async tradeBuy(): Promise<void> {
    await this.steamService.tradeBuy()
  }

  @Get('steam/games/:appId?')
  async getGames(@Param() param?: GetGamesDto): Promise<Games | Games[]> {
    return await this.steamService.getGames(param.appId)
  }
}
