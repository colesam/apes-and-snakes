import {
  WEEKEND_FLUCTUATION_MAX,
  TICKS_PER_WEEKEND,
  RANK_MODIFIERS,
} from "../../config";
import { Pair } from "../../core/card/Pair";
import { mapPairsToRank } from "../../core/poker";
import { RollModifier } from "../../core/stock/RollModifier";
import { Stock } from "../../core/stock/Stock";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { deck } from "../mockData/stocks";
import { getPrivate, setPrivate } from "../privateStore";
import { getShared, setShared } from "../sharedStore";

type Modifier = { expirationTick: number };

export const pureApplyFlop = (
  tick: number,
  stocks: Stock[],
  stockVolatilityModifierMap: { [key: string]: VolatilityModifier[] },
  stockRollModifierMap: { [key: string]: RollModifier[] }
) => {
  const res = {
    stocks: [] as typeof stocks,
    stockVolatilityModifierMap: {} as typeof stockVolatilityModifierMap,
    stockRollModifierMap: {} as typeof stockRollModifierMap,
  };

  const stockPairMap = stocks.reduce<{ [key: string]: Pair }>((acc, stock) => {
    acc[stock.ticker] = stock.pair;
    return acc;
  }, {});

  const [flop] = deck.shuffle().drawFlop();
  const stockRankMap = mapPairsToRank(stockPairMap, flop);

  for (const stockTicker in stockRankMap) {
    // @ts-ignore
    res.stockVolatilityModifierMap[stockTicker] = [
      ...(stockVolatilityModifierMap[stockTicker] || []),
      {
        expirationTick: tick + TICKS_PER_WEEKEND,
        value: WEEKEND_FLUCTUATION_MAX,
      },
    ];
    // @ts-ignore
    res.stockRollModifierMap[stockTicker] = [
      ...(stockRollModifierMap[stockTicker] || []),
      ...RANK_MODIFIERS[stockRankMap[stockTicker]].map(value => ({
        expirationTick: tick + TICKS_PER_WEEKEND,
        value,
      })),
    ];
  }

  res.stocks = stocks.map(stock =>
    stock.set({
      rankHistory: [...stock.rankHistory, stockRankMap[stock.ticker]],
    })
  );

  return res;
};

export const makeApplyFlop = (
  _getShared: typeof getShared,
  _setShared: typeof setShared,
  _getPrivate: typeof getPrivate,
  _setPrivate: typeof setPrivate
) => (tick: number) => {
  let { stocks } = _getShared();
  let { stockVolatilityModifierMap, stockRollModifierMap } = _getPrivate();

  const updates = pureApplyFlop(
    tick,
    stocks,
    stockVolatilityModifierMap,
    stockRollModifierMap
  );

  _setShared({
    stocks: updates.stocks,
  });

  _setPrivate({
    stockVolatilityModifierMap: updates.stockVolatilityModifierMap,
    stockRollModifierMap: updates.stockRollModifierMap,
  });
};

export const applyFlop = makeApplyFlop(
  getShared,
  setShared,
  getPrivate,
  setPrivate
);
