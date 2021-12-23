import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import * as SteamCommunity from "steamcommunity";
import * as TradeOfferManager from "steam-tradeoffer-manager";
import { Cache } from "cache-manager";
import { BotInventoryItem } from "../common/interfaces/inventory-response";

const code = "Y3VY4";
const logOnOptions1 = {
  accountName: "skeef77",
  password: "A737101298TE",
  twoFactorCode: code,
  // captcha: "UKMF9M",
  // steamguard: ""
};

@Injectable()
export class SteamService {
  private manager: any;
  private inventory: any;
  private steamCommunity: SteamCommunity;
  private steamguard: string;
  private oAuthToken: string;
  private cookies: string[];
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.steamCommunity = new SteamCommunity()
    this.manager = new TradeOfferManager()
    this.inventory = null
    this.steamguard = ''
    this.oAuthToken = ''
    this.cookies = []
    this.steamLogin()
  }

  async getCacheLogin(): Promise<void> {
    const cacheSteamguard: string = await this.cacheManager.get('steam_steamguard');
    const cacheOAuthToken: string = await this.cacheManager.get('steam_oAuthToken');
    const cacheCookies: string[] = await this.cacheManager.get('steam_cookies');

    if (cacheSteamguard && cacheOAuthToken) {
      this.steamguard = cacheSteamguard
      this.oAuthToken = cacheOAuthToken
      this.cookies = cacheCookies
    }
  }

  checkLogin(): boolean {
    this.steamCommunity.loggedIn((err, loggedIn) => {
      if (err) {
        console.error(err)
        return false;
      }

      console.log('loggedIn: ', loggedIn);
      return false;
    })

    return false;
  }

  async steamLogin(): Promise<void> {
    await this.getCacheLogin()

    if (this.steamguard && this.oAuthToken) {
      this.loggingSteamOAuth()

      return
    }

    this.loggingSteam()
  }

  loggingSteamOAuth(): void {
    this.steamCommunity.oAuthLogin(this.steamguard, this.oAuthToken, (err) => {
      if (err) {
        console.error(err)
        return;
      }

      this.managerSetCookies(this.cookies)
    })
  }

  managerSetCookies(cookies): void {
    this.manager.setCookies(cookies, (err) => {
      if (err) {
        console.log("setCookies err: ", err.message);

        if (err.message === 'Not Logged In') {
          this.loggingSteam()
        }

        return;
      }

      console.log("Got API key: " + this.manager.apiKey);
    });
  }

  loggingSteam(): void {
    this.steamCommunity.login(
      logOnOptions1,
      async (err, sessionID, cookies, steamguard, oAuthToken) => {
        if (err) {
          console.log("Steam login fail: " + err.message);

          if (err.message === 'CAPTCHA') {
            console.log('Captcha url: ', err.captchaurl)
          }

          return;
        }

        console.log("Logged into Steam");

        await this.cacheManager.set('steam_steamguard', steamguard, {
          ttl: 1000 * 60 * 60 * 60 * 30, // 30day
        });
        await this.cacheManager.set('steam_oAuthToken', oAuthToken, {
          ttl: 1000 * 60 * 60 * 60 * 30, // 30day
        });
        await this.cacheManager.set('steam_cookies', cookies, {
          ttl: 1000 * 60 * 60 * 60 * 30, // 30day
        });

        this.managerSetCookies(cookies);
      }
    )
  }

  async getInventory(): Promise<BotInventoryItem[]> {
    const result: Promise<BotInventoryItem[]> = new Promise((resolve) => {
      this.manager.getInventoryContents(730, 2, true, (err, inventory) => {
        if (err) {
          console.log(err);
          return null;
        }

        if (inventory.length == 0) {
          console.log("CS:GO inventory is empty");
          return null;
        }

        console.log("Found " + inventory.length + " CS:GO items");

        this.inventory = inventory;

        resolve(inventory)
      });
    });

    return result.then((data) => data)
  }

  async tradeSell(items: string[]): Promise<void> {
    const inv = await this.getInventory()
    const findItems = inv.filter((invItem) => items.includes(invItem.id))
    const offer = this.manager.createOffer(
      "https://steamcommunity.com/tradeoffer/new/?partner=1191511061&token=LxFZ3-cK"
    );
    offer.addMyItems(findItems);
    offer.setMessage("TEST API");
    offer.send((err, status) => {
      if (err) {
        console.log(err);
        return;
      }

      if (status == "pending") {
        // We need to confirm it
        console.log(`Offer #${offer.id} sent, but requires confirmation`);
        this.steamCommunity.acceptConfirmationForObject(
          code,
          offer.id,
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Offer confirmed");
            }
          }
        );
      } else {
        console.log(`Offer #${offer.id} sent successfully`);
      }
    });
  }

  tradeBuy(): void {
    console.log('tradeBuy');
  }
}
