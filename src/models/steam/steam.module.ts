import { CacheModule, Module } from "@nestjs/common";
import { SteamService } from "./steam.service";
import { SteamController } from "./steam.controller";
import * as redisStore from 'cache-manager-redis-store';
import { gamesProviders } from "providers/repositories/games.providers";
import { DatabaseModule } from "providers/database/database.module";

@Module({
  imports: [CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: 6379,
  }), DatabaseModule],
  controllers: [SteamController],
  providers: [SteamService,
    ...gamesProviders,
  ],
})
export class SteamModule {}
