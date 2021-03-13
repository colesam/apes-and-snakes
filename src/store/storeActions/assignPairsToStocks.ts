import { TStore } from "../store";

export const assignPairsToStocks = (s: TStore) => {
  for (const stock of s.stocks) {
    stock.setPair(s.deck.drawPair(), s.flop);
  }
};
