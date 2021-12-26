import { Controller, Get, UseInterceptors, Request, Param, Post } from "@nestjs/common";
import { UsersService } from './users.service';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';
import { GetUserInventoryParamDto } from './dto/get-user-inventory.dto';

@UseInterceptors(ResponseInterceptor)
@Controller()
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('user/inventory/:steamid')
  async getUserInventory(@Request() req, @Param() param?: GetUserInventoryParamDto) {
    return await this.userService.getUserInventory(param.steamid);
  }

  @Post('user/trade/:steamid')
  async sendTrade(@Param() param?: GetUserInventoryParamDto) {
    return await this.userService.sendTrade(param.steamid);
  }
}
