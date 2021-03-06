import { getAuthorizedPlayer } from "./storeSelectors/getAuthorizedPlayer";
import { getPlayer } from "./storeSelectors/getPlayer";
import { getRollModifiers } from "./storeSelectors/getRollModifiers";
import { getVolatilityModifiers } from "./storeSelectors/getVolatilityModifiers";
import { stockPriceMap } from "./storeSelectors/stockPriceMap";
import { syncedState } from "./storeSelectors/syncedState";

export const StoreSelector = {
  getPlayer,
  getVolatilityModifiers,
  getRollModifiers,
  stockPriceMap,
  getAuthorizedPlayer,
  syncedState,
};
