import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import * as SteamCommunity from "steamcommunity";
import * as TradeOfferManager from "steam-tradeoffer-manager";
import axios from "axios";
import {
  InventoryResponse,
  RgDescriptionsResponse,
  RgInventoryResponse,
} from "../common/interfaces/inventory-response";

const steamApi = axios.create({
  baseURL: "https://steamcommunity.com",
});
const steamCommunity = new SteamCommunity();
const manager = new TradeOfferManager();

const code = "YPJ7B";
const logOnOptions1 = {
  accountName: "skeef77",
  password: "A737101298TE",
  // twoFactorCode: code,
  captcha: 'DKP9M&',
};

// const logOnOptions2 = {
//   accountName: "ggezswap01",
//   password: "2T417jjTDmKmevco",
//   authCode: "VKH3N",
// };

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private readonly users = [
    {
      userId: 1,
      username: "john",
      password: "changeme",
    },
    {
      userId: 2,
      username: "maria",
      password: "guess",
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  private getItemsId(data: RgInventoryResponse) {
    return Object.values(data).map(
      (item) => `${item.classid}_${item.instanceid}`
    );
  }

  private getInventoryInfo(data: RgDescriptionsResponse) {
    return Object.entries(data).map(([key, item]) => {
      return {
        appId: item.appid,
        assetId: key,
        botPrice: null,
        collection: null,
        defaultPrice: null,
        float: null,
        fullName: item.market_name,
        hasHighDemand: null,
        id: item.appid,
        img: null,
        inspect: null,
        nameId: null,
        overstockDiff: null,
        pattern: null,
        price: null,
        quality: null,
        rarity: null,
        steamImg: `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}`,
        steamImgLarge: `https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url_large}`,
        type: null,
      };
    });
  }

  async getUserInventory(steam_id: string): Promise<any> {
    const cacheData = await this.cacheManager.get(steam_id);

    if (cacheData) {
      return cacheData;
    }

    const { data }: { data: InventoryResponse } = await steamApi.get(
      `/profiles/${steam_id}/inventory/json/730/2`
    );

    const inventoryFormatting = this.getInventoryInfo(data.rgDescriptions);

    await this.cacheManager.set(steam_id, inventoryFormatting, {
      ttl: 1000 * 60 * 15, // 15 min
    });

    return inventoryFormatting;
  }

  async sendTrade(steam_id: string): Promise<any> {
    await steamCommunity.login(
      logOnOptions1,
      function (err, sessionID, cookies, steamguard) {
        if (err) {
          console.log("Steam login fail: " + err.message);
          console.log("Steam steamguard fail: " + steamguard);
          process.exit(1);
        }

        console.log("Logged into Steam");
        console.log("Steam cookies: ", cookies);

        manager.setCookies(cookies, function (err) {
          if (err) {
            console.log("setCookies err: ", err);
            process.exit(1); // Fatal error since we couldn't get our API key
            return;
          }

          console.log("Got API key: " + manager.apiKey);
        });
      }
    );
  }
}
