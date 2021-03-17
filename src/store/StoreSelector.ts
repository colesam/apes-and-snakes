import { getAuthorizedPlayer } from "./storeSelectors/getAuthorizedPlayer";
import { getPlayer } from "./storeSelectors/getPlayer";
import { getRollModifiers } from "./storeSelectors/getRollModifiers";
import { getVolatilityModifiers } from "./storeSelectors/getVolatilityModifiers";
import { stockPriceMap } from "./storeSelectors/stockPriceMap";
import { syncedState } from "./storeSelectors/syncedState";
import { viewedPlayer } from "./storeSelectors/viewedPlayer";
import { viewedPlayerPortfolio } from "./storeSelectors/viewedPlayerPortfolio";

export const StoreSelector = {
  viewedPlayerPortfolio,
  viewedPlayer,
  getPlayer,
  getVolatilityModifiers,
  getRollModifiers,
  stockPriceMap,
  getAuthorizedPlayer,
  syncedState,
};
