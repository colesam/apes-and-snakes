import { SIM_WEEKS, TICKS_PER_WEEK } from "../../config";
import { StoreAction } from "../StoreAction";
import { privateState } from "../privateState";
import { setPrivate } from "../privateStore";
import { sharedState } from "../sharedState";
import { setShared } from "../sharedStore";

export const setupGame = () => {
  // Reset state
  setShared(s => ({
    tick: sharedState.tick,
    stocks: sharedState.stocks,
    players: s.players.map(p => p.set({ positions: [], cash: 1_000_000 })),
    flopDisplay: null,
  }));
  setPrivate({
    flop: null,
    stockVolatilityModifierMap: privateState.stockVolatilityModifierMap,
    stockRollModifierMap: privateState.stockRollModifierMap,
  });

  StoreAction.assignPairsToStocks();
  StoreAction.runTicks(SIM_WEEKS * TICKS_PER_WEEK);
};
