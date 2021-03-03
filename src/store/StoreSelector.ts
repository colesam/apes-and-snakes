import { getAuthorizedPlayer } from "./storeSelectors/getAuthorizedPlayer";
import { getRollModifiers } from "./storeSelectors/getRollModifiers";
import { getVolatilityModifiers } from "./storeSelectors/getVolatilityModifiers";
import { stockPriceMap } from "./storeSelectors/stockPriceMap";
import { syncedState } from "./storeSelectors/syncedState";

export const StoreSelector = {
  getVolatilityModifiers,
  getRollModifiers,
  stockPriceMap,
  getAuthorizedPlayer,
  syncedState,
};
