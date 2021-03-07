import { cloneDeep } from "lodash";
import { SIM_WEEKS, TICKS_PER_WEEK } from "../../config";
import { StoreAction } from "../StoreAction";
import { initialState, TStore } from "../store";

export const setupGame = (s: TStore) => {
  // Reset state
  const init = cloneDeep(initialState);
  s.tick = init.tick;
  s.stocks = init.stocks;
  s.stockVolatilityModifierMap = init.stockVolatilityModifierMap;
  s.stockRollModifierMap = init.stockRollModifierMap;

  for (let player of s.players) {
    player.positionBids = [];
    player.positionBundles = new Map();
    player.cash = 1_000_000;
  }

  StoreAction.assignPairsToStocks(s);
  s.flop = s.deck.drawFlop();

  StoreAction.runTicks(SIM_WEEKS * TICKS_PER_WEEK)(s);
};
