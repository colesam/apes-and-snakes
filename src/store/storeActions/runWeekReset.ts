import { DRAW_PAIR_CHANCE } from "../../config";
import { TStore } from "../store";

export const runWeekReset = (s: TStore) => {
  for (const stock of s.stocks) {
    // Each card has 10% chance of getting new cards
    if (Math.random() < DRAW_PAIR_CHANCE) {
      s.deck.insert(stock.pair.cards).shuffle();
      stock.pair = s.deck.drawPair();
      stock.pairIsNew = true;
    } else {
      stock.pairIsNew = false;
    }
  }

  s.deck.insert(s.flop ? s.flop.cards : []).shuffle();
  s.flopDisplay = null;
  s.flop = null;
};
