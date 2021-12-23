import { CacheModule, Module } from "@nestjs/common";
import { SteamService } from "./steam.service";
import { SteamController } from "./steam.controller";
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: 6379,
  })],
  providers: [SteamService],
  controllers: [SteamController],
})
export class SteamModule {}
