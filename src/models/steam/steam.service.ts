import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import * as SteamCommunity from "steamcommunity";
import * as TradeOfferManager from "steam-tradeoffer-manager";
import { Cache } from "cache-manager";
import { BotInventoryItem } from "../../common/interfaces/inventory-response";
import { Repositories } from "config/repositories";
import { Games } from "models/steam/entities/game.entity";

@Injectable()
export class SteamService {
  private manager: any;
  private inventory: any;
  private steamCommunity: SteamCommunity;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(Repositories.GAMES_REPOSITORY)
    private gamesRepository: typeof Games,
  ) {
    this.steamCommunity = new SteamCommunity()
    this.manager = new TradeOfferManager()
    this.inventory = null
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
          '123',
          offer.id,
          function (err) {
            if (err) {
              console.log("Error confirmation order: ", err);
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

  async getGames(app_id?: string): Promise<Games | Games[]> {
    if (app_id) {
      return [await this.gamesRepository.findOne({
        where: {
          app_id,
        }
      })]
    }

    return await this.gamesRepository.findAll()
  }
}
