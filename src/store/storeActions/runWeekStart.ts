import {
  DRAW_PAIR_CHANCE,
  RANK_MODIFIERS,
  TICKS_PER_WEEKEND,
  WEEKEND_VOLATILITY_MOD,
} from "../../config";
import { Pair } from "../../core/card/Pair";
import { mapPairsToRank } from "../../core/poker";
import { RollModifier } from "../../core/stock/RollModifier";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { StoreAction } from "../StoreAction";
import { TStore } from "../store";

/**
 * Update the flop with a new card and calculate the current rank of all stocks.
 */
export const runWeekStart = (tick: number) => (s: TStore) => {
  if (!s.flop) {
    throw Error("Flop is missing!");
  }

  // Update flop
  s.deck.push([s.retiredCard]);
  s.retiredCard = s.flop.push(s.deck.shuffle().drawOne());

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

  const stockPairMap = s.stocks.reduce<{ [key: string]: Pair }>(
    (acc, stock) => {
      acc[stock.ticker] = stock.pair;
      return acc;
    },
    {}
  );

  const stockRankMap = mapPairsToRank(stockPairMap, s.flop);

  for (const stockTicker in stockRankMap) {
    StoreAction.pushVolatilityModifiers(stockTicker, [
      new VolatilityModifier({
        expirationTick: tick + TICKS_PER_WEEKEND,
        value: WEEKEND_VOLATILITY_MOD,
      }),
    ])(s);
  }

  for (const stockTicker in stockRankMap) {
    const rank = stockRankMap[stockTicker];
    StoreAction.pushRollModifiers(
      stockTicker,
      RANK_MODIFIERS[rank].map(
        value =>
          new RollModifier({
            expirationTick: tick + TICKS_PER_WEEKEND,
            value,
          })
      )
    )(s);
  }

  for (const stock of s.stocks) {
    stock.rankHistory.push(stockRankMap[stock.ticker]);
  }
};
