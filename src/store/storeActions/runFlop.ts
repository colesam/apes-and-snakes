import {
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

export const runFlop = (tick: number) => (s: TStore) => {
  if (!s.flop) {
    throw Error("Flop is missing!");
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

  s.flopDisplay = s.flop;
};
