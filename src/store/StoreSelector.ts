import { getAuthorizedPlayer } from "./storeSelectors/getAuthorizedPlayer";
import { stockPriceMap } from "./storeSelectors/stockPriceMap";
import { syncedState } from "./storeSelectors/syncedState";

export const StoreSelector = {
  stockPriceMap,
  getAuthorizedPlayer,
  syncedState,
};
