import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";
import { SteamModule } from "../steam/steam.module";

@Module({
  imports: [AuthModule, UsersModule, SteamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
