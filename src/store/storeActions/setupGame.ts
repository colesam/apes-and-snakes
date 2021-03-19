import { SIM_WEEKS, TICKS_PER_WEEK } from "../../config";
import { Deck } from "../../core/card/Deck";
import { StoreAction } from "../StoreAction";
import { initialState, TStore } from "../store";

export const setupGame = (s: TStore) => {
  // Reset state
  const init = initialState();
  s.tick = init.tick;
  s.stocks = init.stocks;

  for (const stock of init.stocks.values()) {
    s.stocks.set(stock.ticker, stock);
  }

  for (let player of s.players) {
    player.positionBids.clear();
    player.positionBundles.clear();
    player.cash = 5_000_000;
  }

  s.deck = new Deck().shuffle();

  s.flop = s.deck.drawFlop();

  StoreAction.assignPairsToStocks(s);

  StoreAction.runTicks(SIM_WEEKS * TICKS_PER_WEEK)(s);
};
