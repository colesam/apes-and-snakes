import { Deck } from "../../core/card/Deck";
import { TStore } from "../store";

export const assignPairsToStocks = (s: TStore) => {
  s.deck = new Deck().shuffle();
  for (const stock of s.stocks) {
    stock.pair = s.deck.drawPair();
  }
};
