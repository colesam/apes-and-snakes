import { SIM_WEEKS, TICKS_PER_WEEK } from "../../config";
import { StoreAction } from "../StoreAction";
import { initialState, setStore } from "../store";

export const setupGame = () => {
  // Reset state
  setStore(s => ({
    tick: initialState.tick,
    stocks: initialState.stocks,
    players: s.players.map(p => p.set({ positions: [], cash: 1_000_000 })),
    flopDisplay: null,
    flop: null,
    stockVolatilityModifierMap: initialState.stockVolatilityModifierMap,
    stockRollModifierMap: initialState.stockRollModifierMap,
  }));

  StoreAction.assignPairsToStocks();
  StoreAction.runTicks(SIM_WEEKS * TICKS_PER_WEEK);
};
