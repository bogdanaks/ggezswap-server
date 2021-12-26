import { Controller, Get, Post, Request, UseGuards, Response } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SteamAuthGuard } from '../auth/guards/steam-auth.guard';
import axios from 'axios';
import { SteamPlayer } from './interfaces';

const steamApi = axios.create({
  baseURL: 'https://api.steampowered.com',
});

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(SteamAuthGuard)
  @Post('auth/steam/login')
  async login(@Request() req) {
    console.log('req: ', req);

    return req.user;
  }

  @Get('auth/steam/return')
  async steamReturn(@Request() req, @Response() res) {
    const apiKey = '24A2AAAFEABDE6FB02CCA3BC790899A4';
    const steamId = req.query['openid.claimed_id'].split(
      'https://steamcommunity.com/openid/id/',
    )[1];

    const { data } = await steamApi.get(
      `/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`,
    );

    const playerInfo: SteamPlayer = data.response.players[0];

    res.cookie('steamProfile', JSON.stringify(playerInfo));
    res.redirect('http://localhost:3001');
  }
}
