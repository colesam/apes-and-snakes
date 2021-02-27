import {
  FLOP_PREVIEW_POINT,
  RANK_MODIFIERS,
  TICKS_PER_WEEK,
  TICKS_PER_WEEKEND,
  WEEKEND_FLUCTUATION_MAX,
  WEEKEND_START,
} from "../../config";
import { Pair } from "../../core/card/Pair";
import { mapPairsToRank } from "../../core/poker";
import { tickPrice } from "../../core/stock/tickPrice";
import { getPrivate, setPrivate } from "../privateStore";
import { getShared, setShared } from "../sharedStore";
import { TMap } from "../types/TMap";

// TODO: break up this file

type Modifier = { expirationTick: number };
type ModifierMap<T extends Modifier> = TMap<T[]>;

function isFlopPreview(tick: number) {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(FLOP_PREVIEW_POINT * TICKS_PER_WEEK);
}

function isWeekend(tick: number) {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(WEEKEND_START * TICKS_PER_WEEK);
}

function isEndOfWeek(tick: number) {
  return tick % TICKS_PER_WEEK === 0;
}

const expireModifiers = <T extends Modifier>(
  tick: number,
  modMap: ModifierMap<T>
): ModifierMap<T> =>
  Object.entries(modMap).reduce<ModifierMap<T>>((acc, [key, mods]) => {
    acc[key] = mods.filter(m => m.expirationTick > tick);
    return acc;
  }, {});

export const runTicks = (numTicks: number) => {
  let { tick: initialTick, stocks } = getShared();
  let { deck, stockVolatilityModifierMap, stockRollModifierMap } = getPrivate();

  for (let tick = initialTick; tick < initialTick + numTicks; tick++) {
    // Expire modifiers
    stockVolatilityModifierMap = expireModifiers(
      tick,
      stockVolatilityModifierMap
    );
    stockRollModifierMap = expireModifiers(tick, stockRollModifierMap);

    // Tick prices
    stocks = stocks.map(stock =>
      tickPrice(
        stock,
        stockVolatilityModifierMap[stock.ticker] || [],
        stockRollModifierMap[stock.ticker] || []
      )
    );

    if (isFlopPreview(tick)) {
      const [flop, newDeck] = deck.drawFlop();

      setShared({ flopDisplay: flop.preview });
      setPrivate({ flop, deck: newDeck });
    } else if (isWeekend(tick)) {
      const { flop } = getPrivate();

      if (!flop) {
        throw Error("Flop is missing!");
      }

      const stockPairMap = stocks.reduce<{ [key: string]: Pair }>(
        (acc, stock) => {
          acc[stock.ticker] = stock.pair;
          return acc;
        },
        {}
      );

      const stockRankMap = mapPairsToRank(stockPairMap, flop);

      for (const stockTicker in stockRankMap) {
        // @ts-ignore
        stockVolatilityModifierMap[stockTicker] = [
          ...(stockVolatilityModifierMap[stockTicker] || []),
          {
            expirationTick: tick + TICKS_PER_WEEKEND,
            value: WEEKEND_FLUCTUATION_MAX,
          },
        ];
        // @ts-ignore
        stockRollModifierMap[stockTicker] = [
          ...(stockRollModifierMap[stockTicker] || []),
          ...RANK_MODIFIERS[stockRankMap[stockTicker]].map(value => ({
            expirationTick: tick + TICKS_PER_WEEKEND,
            value,
          })),
        ];
      }

      stocks = stocks.map(stock =>
        stock.set({
          rankHistory: [...stock.rankHistory, stockRankMap[stock.ticker]],
        })
      );
      setShared({ flopDisplay: flop });
    } else if (isEndOfWeek(tick)) {
      setShared({ flopDisplay: null });
      setPrivate({ flop: null });
    }
  }

  setShared({ tick: initialTick + numTicks, stocks });
  setPrivate({ stockVolatilityModifierMap, stockRollModifierMap });
};
