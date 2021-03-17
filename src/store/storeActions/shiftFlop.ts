import { logDebug } from "../../util/log";
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
  logDebug("Updating the flop");
  s.deck.push([s.retiredCard]);
  s.retiredCard = s.flop.pushShift(s.deck.shuffle().drawOne());
  s.flopSetAt = s.tick;

  // Update solved hands
  for (const stock of s.stocks.values()) {
    stock.updateSolvedHand(s.flop);
  }

  // Recalculate ranks
  StoreAction.rankStocks(s);
};
