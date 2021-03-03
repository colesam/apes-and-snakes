import produce from "immer";
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
import { mapPairsToRank } from "../../core/poker";
import { RollModifier } from "../../core/stock/RollModifier";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { tickPrice } from "../../core/stock/tickPrice";
import { getStore, setStore } from "../store";

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
  modMap: Map<string, T[]>
): Map<string, T[]> =>
  produce(modMap, (draft: Map<string, T[]>) => {
    for (const [key, mods] of modMap.entries()) {
      draft.set(
        key,
        mods.filter(m => m.expirationTick > tick)
      );
    }
  });

export const runTicks = (numTicks: number) => {
  let {
    tick: initialTick,
    stocks,
    flopDisplay,
    deck,
    stockVolatilityModifierMap,
    stockRollModifierMap,
    flop,
  } = getStore();

  for (let tick = initialTick; tick < initialTick + numTicks; tick++) {
    // Expire modifiers
    stockVolatilityModifierMap = expireModifiers(
      tick,
      stockVolatilityModifierMap
    );
    stockRollModifierMap = expireModifiers(tick, stockRollModifierMap);

    // Tick prices
    // eslint-disable-next-line no-loop-func
    stocks = stocks.map(stock =>
      tickPrice(
        stock,
        stockVolatilityModifierMap.get(stock.ticker) || [],
        stockRollModifierMap.get(stock.ticker) || []
      )
    );

    if (isFlopPreview(tick)) {
      const [newFlop, newDeck] = deck.drawFlop();
      // State updates
      flop = newFlop;
      flopDisplay = flop.preview;
      deck = newDeck;
    } else if (isWeekend(tick)) {
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

      stockVolatilityModifierMap = produce(
        stockVolatilityModifierMap,
        draft => {
          for (const stockTicker in stockRankMap) {
            const mods = stockVolatilityModifierMap.get(stockTicker) || [];
            draft.set(stockTicker, [
              ...mods,
              new VolatilityModifier({
                expirationTick: tick + TICKS_PER_WEEKEND,
                value: WEEKEND_VOLATILITY_MOD,
              }),
            ]);
          }
        }
      );

      stockRollModifierMap = produce(stockRollModifierMap, draft => {
        for (const stockTicker in stockRankMap) {
          const rank = stockRankMap[stockTicker];
          const mods = stockRollModifierMap.get(stockTicker) || [];
          draft.set(stockTicker, [
            ...mods,
            ...RANK_MODIFIERS[rank].map(
              value =>
                new RollModifier({
                  expirationTick: tick + TICKS_PER_WEEKEND,
                  value,
                })
            ),
          ]);
        }
      });

      stocks = stocks.map(stock =>
        stock.set({
          rankHistory: [...stock.rankHistory, stockRankMap[stock.ticker]],
        })
      );

      // State updates
      flopDisplay = flop;
    } else if (isEndOfWeek(tick)) {
      // Each card has 10% chance of getting new cards

      // State updates
      // eslint-disable-next-line no-loop-func
      stocks = stocks.map(stock => {
        if (Math.random() < DRAW_PAIR_CHANCE) {
          const [newPair, newDeck] = deck
            .insert(stock.pair.cards)
            .shuffle()
            .drawPair();
          deck = newDeck;
          return stock.set({
            pair: newPair,
            pairIsNew: true,
          });
        } else {
          return stock.set({ pairIsNew: false });
        }
      });
      flopDisplay = null;
      deck = deck.insert(flop ? flop.cards : []).shuffle();
      flop = null;
    }
  }

  setStore({
    tick: initialTick + numTicks,
    stocks,
    flopDisplay,
    deck,
    stockVolatilityModifierMap,
    stockRollModifierMap,
    flop,
  });
};
