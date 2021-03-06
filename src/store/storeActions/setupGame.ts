import { SIM_WEEKS, TICKS_PER_WEEK } from "../../config";
import { StoreAction } from "../StoreAction";
import { initialState, TStore } from "../store";

export const setupGame = (s: TStore) => {
  // Reset state
  s.tick = initialState.tick;
  s.stocks = initialState.stocks;
  s.stockVolatilityModifierMap = initialState.stockVolatilityModifierMap;
  s.stockRollModifierMap = initialState.stockRollModifierMap;

  for (let player of s.players) {
    player.positions = [];
    player.cash = 1_000_000;
  }

  StoreAction.assignPairsToStocks(s);
  s.flop = s.deck.drawFlop();

  StoreAction.runTicks(SIM_WEEKS * TICKS_PER_WEEK)(s);
};
