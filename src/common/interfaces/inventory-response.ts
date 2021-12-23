import CEconItem from "steamcommunity/classes/CEconItem";

export type RgInventoryResponse = Array<{
  [key: string]: {
    id: string;
    classid: string;
    instanceid: string;
    amount: string;
    hide_in_china: number;
    pos: number;
  };
}>;

export type RgDescriptionsResponse = Array<{
  [key: string]: {
    appid: string;
    classid: string;
    instanceid: string;
    icon_url: string;
    icon_drag_url: string;
    name: string;
    market_hash_name: string;
    market_name: string;
    name_color: string;
    background_color: string;
    type: string;
    tradable: number;
    marketable: number;
    commodity: number;
    market_tradable_restriction: string;
    market_buy_country_restriction: string;
    descriptions: any[];
    tags: any[];
  };
}>;

export interface InventoryResponse {
  success: boolean;
  rgInventory: RgInventoryResponse;
  rgCurrency: any[];
  rgDescriptions: RgDescriptionsResponse;
}

export type BotInventoryItem = CEconItem
