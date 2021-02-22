import {
  ROUND_FLUCTUATION_MAX,
  ROUND_MODIFIER_TICK_LIFETIME,
  ROUND_RANK_MODIFIERS,
} from "../../config";
import { Pair } from "../../core/card/Pair";
import { mapPairsToRank } from "../../core/poker";
import { deck } from "../mockData/stocks";
import { getPrivate, setPrivate } from "../privateStore";
import { getShared, setShared } from "../sharedStore";

type Modifier = { expirationTick: number };

export const makeApplyFlop = (
  _getShared: typeof getShared,
  _setShared: typeof setShared,
  _getPrivate: typeof getPrivate,
  _setPrivate: typeof setPrivate
) => (tick: number) => {
  let { stocks } = _getShared();
  let { stockVolatilityModifierMap, stockRollModifierMap } = _getPrivate();

  const stockPairMap = stocks.reduce<{ [key: string]: Pair }>((acc, stock) => {
    acc[stock.ticker] = stock.pair;
    return acc;
  }, {});

  const [flop] = deck.shuffle().drawFlop();
  const stockRankMap = mapPairsToRank(stockPairMap, flop);

  for (const stockTicker in stockRankMap) {
    // @ts-ignore
    stockVolatilityModifierMap[stockTicker] = [
      ...(stockVolatilityModifierMap[stockTicker] || []),
      {
        expirationTick: tick + ROUND_MODIFIER_TICK_LIFETIME,
        value: ROUND_FLUCTUATION_MAX,
      },
    ];
    // @ts-ignore
    stockRollModifierMap[stockTicker] = [
      ...(stockRollModifierMap[stockTicker] || []),
      ...ROUND_RANK_MODIFIERS[stockRankMap[stockTicker]].map(value => ({
        expirationTick: tick + ROUND_MODIFIER_TICK_LIFETIME,
        value,
      })),
    ];
  }

  _setShared({
    stocks: stocks.map(stock =>
      stock.set({
        rankHistory: [...stock.rankHistory, stockRankMap[stock.ticker]],
      })
    ),
  });

  _setPrivate({ stockVolatilityModifierMap, stockRollModifierMap });
};

export const applyFlop = makeApplyFlop(
  getShared,
  setShared,
  getPrivate,
  setPrivate
);
