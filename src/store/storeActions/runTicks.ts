import { random } from "lodash";
import {
  DRAW_PAIR_CHANCE,
  FLOP_SHIFT_CHANCE,
  FLOP_SHIFT_COOLDOWN,
  PLAYER_CASH_GROWTH_RATE,
} from "../../config";
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

const runSingleTick = (tick: number) => (s: TStore) => {
  // Updates that run every tick
  expireModifiers(s.stockVolatilityModifierMap, tick);
  expireModifiers(s.stockRollModifierMap, tick);

  for (const stock of s.stocks.values()) {
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

    StoreAction.updateStockBids(stock)(s);
  }

  // Updates at specific points of the week
  if (isStartOfWeek(tick)) {
    for (const stock of s.stocks.values()) {
      // NOTE: Keep this loop separate so it doesn't affect prices mid tick
      if (Math.random() < DRAW_PAIR_CHANCE) {
        const replaceIndex = random(1);
        const replacedCard = stock.pair.cards[replaceIndex];

        stock.pair.cards[replaceIndex] = s.deck.shuffle().drawOne();
        stock.newPairCards.push(stock.pair.cards[replaceIndex]);
        stock.updateSolvedHand(s.flop);

        s.deck.push([replacedCard]).shuffle();
      } else {
        stock.newPairCards = [];
      }
    }
    StoreAction.rankStocks(s);
    if (tick > 0) {
      for (const player of s.players) {
        player.cash += player.cash * PLAYER_CASH_GROWTH_RATE;
      }
    }
  }

  if (
    tick - s.flopSetAt > FLOP_SHIFT_COOLDOWN &&
    Math.random() < FLOP_SHIFT_CHANCE
  ) {
    StoreAction.shiftFlop(s);
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
