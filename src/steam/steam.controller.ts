import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { SteamService } from './steam.service';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { BotInventoryItem } from "../common/interfaces/inventory-response";
import { TradeSellDto } from "./dto/trade-sell.dto";

@UseInterceptors(ResponseInterceptor)
@Controller()
export class SteamController {
  constructor(private readonly steamService: SteamService) {}

  @Get('steam/inventory/') // only inner API, maybe delete it
  async getSteamInventory(): Promise<BotInventoryItem[]> {
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
}
