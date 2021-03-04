import { produce } from "immer";
import {
  DRAW_PAIR_CHANCE,
  FLOP_PREVIEW_POINT,
  RANK_MODIFIERS,
  TICKS_PER_WEEK,
  TICKS_PER_WEEKEND,
  WEEKEND_VOLATILITY_MOD,
  WEEKEND_START,
} from "../../config";
import { Pair } from "../../core/card/Pair";
import { GuaranteedMap } from "../../core/common/GuaranteedMap";
import { mapPairsToRank } from "../../core/poker";
import { RollModifier } from "../../core/stock/RollModifier";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { tickPrice } from "../../core/stock/tickPrice";
import { TStore } from "../store";

type Modifier = { expirationTick: number };

function isFlopPreview(tick: number) {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(FLOP_PREVIEW_POINT * TICKS_PER_WEEK);
}

function isWeekend(tick: number) {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(WEEKEND_START * TICKS_PER_WEEK) - 1;
}

function isEndOfWeek(tick: number) {
  return tick % TICKS_PER_WEEK === TICKS_PER_WEEK - 1;
}

const expireModifiers = <T extends Modifier>(
  tick: number,
  modMap: GuaranteedMap<string, T[]>
): GuaranteedMap<string, T[]> =>
  produce(modMap, (draft: Map<string, T[]>) => {
    for (const [key, mods] of modMap) {
      draft.set(
        key,
        mods.filter(m => m.expirationTick > tick)
      );
    }
  });

export const runTicks = (numTicks: number) => (s: TStore) => {
  const initialTick = s.tick;

  for (let tick = initialTick; tick < initialTick + numTicks; tick++) {
    // Expire modifiers
    s.stockVolatilityModifierMap = expireModifiers(
      tick,
      s.stockVolatilityModifierMap
    );
    s.stockRollModifierMap = expireModifiers(tick, s.stockRollModifierMap);

    // Tick prices
    s.stocks = s.stocks.map(stock =>
      tickPrice(
        stock,
        s.stockVolatilityModifierMap.get(stock.ticker),
        s.stockRollModifierMap.get(stock.ticker)
      )
    );

    if (isFlopPreview(tick)) {
      // State updates
      s.flop = s.deck.drawFlop();
      s.flopDisplay = s.flop.preview;
    } else if (isWeekend(tick)) {
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
        s.stockVolatilityModifierMap.get(stockTicker).push(
          new VolatilityModifier({
            expirationTick: tick + TICKS_PER_WEEKEND,
            value: WEEKEND_VOLATILITY_MOD,
          })
        );
      }

      for (const stockTicker in stockRankMap) {
        const rank = stockRankMap[stockTicker];
        s.stockRollModifierMap.get(stockTicker).push(
          ...RANK_MODIFIERS[rank].map(
            value =>
              new RollModifier({
                expirationTick: tick + TICKS_PER_WEEKEND,
                value,
              })
          )
        );
      }

      for (const stock of s.stocks) {
        stock.rankHistory.push(stockRankMap[stock.ticker]);
      }

      s.flopDisplay = s.flop;
    } else if (isEndOfWeek(tick)) {
      // Each card has 10% chance of getting new cards

      // State updates
      // eslint-disable-next-line no-loop-func
      for (const stock of s.stocks) {
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
    }
  }

  s.tick = initialTick + numTicks;
};
