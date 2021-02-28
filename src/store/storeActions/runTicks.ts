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
  return relativeTick === Math.floor(WEEKEND_START * TICKS_PER_WEEK) - 1;
}

function isEndOfWeek(tick: number) {
  return tick % TICKS_PER_WEEK === TICKS_PER_WEEK - 1;
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
  let { tick: initialTick, stocks, flopDisplay } = getShared();
  let {
    deck,
    stockVolatilityModifierMap,
    stockRollModifierMap,
    flop,
  } = getPrivate();

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
        stockVolatilityModifierMap[stock.ticker] || [],
        stockRollModifierMap[stock.ticker] || []
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

      for (const stockTicker in stockRankMap) {
        // @ts-ignore
        stockVolatilityModifierMap[stockTicker] = [
          ...(stockVolatilityModifierMap[stockTicker] || []),
          {
            expirationTick: tick + TICKS_PER_WEEKEND,
            value: WEEKEND_VOLATILITY_MOD,
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

  setShared({ tick: initialTick + numTicks, stocks, flopDisplay });
  setPrivate({ deck, stockVolatilityModifierMap, stockRollModifierMap, flop });
};
