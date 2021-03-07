import { StoreAction } from "../StoreAction";
import { TStore } from "../store";

/**
 * Update the flop with a new card and calculate the current rank of all stocks.
 */
export const shiftFlop = (s: TStore) => {
  if (!s.flop) {
    throw Error("Flop is missing!");
  }

  // Update flop
  console.log("[DEBUG] Updating flop");
  s.deck.push([s.retiredCard]);
  s.retiredCard = s.flop.push(s.deck.shuffle().drawOne());

  StoreAction.rankStocks(s);
};
