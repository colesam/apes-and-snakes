import { DRAW_PAIR_CHANCE, FLOP_SHIFT_CHANCE } from "../../config";
import { isStartOfWeek } from "../../core/helpers";
import { tickPrice } from "../../core/stock/tickPrice";
import { StoreAction } from "../StoreAction";
import { TStore } from "../store";

export const runTicks = (numTicks: number) => (s: TStore) => {
  const initialTick = s.tick;
  numTicks = Math.ceil(numTicks);

  for (let tick = initialTick; tick < initialTick + numTicks; tick++) {
    runSingleTick(tick)(s);
  }

  s.tick = initialTick + numTicks;
};

let flop = 0;

const runSingleTick = (tick: number) => (s: TStore) => {
  // Updates that run every tick
  expireModifiers(s.stockVolatilityModifierMap, tick);
  expireModifiers(s.stockRollModifierMap, tick);

  for (const stock of s.stocks) {
    tickPrice(
      stock,
      s.stockVolatilityModifierMap.get(stock.ticker) || [],
      s.stockRollModifierMap.get(stock.ticker) || []
    );

    // Update volume
    if (
      stock.hasBuySqueeze ||
      (stock.buyVolume < 15_000 && Math.random() < 0.1)
    ) {
      stock.buyVolume += 1_000;
    }

    if (
      stock.hasSellSqueeze ||
      (stock.sellVolume < 15_000 && Math.random() < 0.1)
    ) {
      stock.sellVolume += 1_000;
    }
  }

  StoreAction.updateStockBids(s);

  // Updates at specific points of the week
  if (isStartOfWeek(tick)) {
    for (const stock of s.stocks) {
      // Each card has 10% chance of getting new cards
      if (Math.random() < DRAW_PAIR_CHANCE) {
        s.deck.push(stock.pair.cards).shuffle();
        stock.pair = s.deck.drawPair();
        stock.pairIsNew = true;
      } else {
        stock.pairIsNew = false;
      }
    }
    StoreAction.rankStocks(s);
  } else {
    if (Math.random() < FLOP_SHIFT_CHANCE) {
      // 50% chance per week of extra flop shift
      flop++;
      console.log(`Flipping flop #${flop}`);
      StoreAction.shiftFlop(s);
    }
  }
};

type Modifier = { expirationTick: number };
const expireModifiers = <T extends Modifier>(
  modMap: Map<string, T[]>,
  tick: number
): void => {
  for (const [key, mods] of modMap) {
    modMap.set(
      key,
      mods.filter(m => m.expirationTick > tick)
    );
  }
};
