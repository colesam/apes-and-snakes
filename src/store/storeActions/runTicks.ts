import {
  FLOP_PREVIEW_POINT,
  TICKS_PER_WEEK,
  WEEKEND_START,
} from "../../config";
import { GuaranteedMap } from "../../core/common/GuaranteedMap";
import { tickPrice } from "../../core/stock/tickPrice";
import { StoreAction } from "../StoreAction";
import { TStore } from "../store";

export const runTicks = (numTicks: number) => (s: TStore) => {
  const initialTick = s.tick;

  for (let tick = initialTick; tick < initialTick + numTicks; tick++) {
    runSingleTick(tick)(s);
  }

  s.tick = initialTick + numTicks;
};

const runSingleTick = (tick: number) => (s: TStore) => {
  // Updates that run every tick
  expireModifiers(s.stockVolatilityModifierMap, tick);
  expireModifiers(s.stockRollModifierMap, tick);

  s.stocks = s.stocks.map(stock =>
    tickPrice(
      stock,
      s.stockVolatilityModifierMap.get(stock.ticker),
      s.stockRollModifierMap.get(stock.ticker)
    )
  );

  // Updates at specific points of the week
  if (isFlopPreview(tick)) {
    StoreAction.runFlopPreview(s);
  }

  if (isWeekend(tick)) {
    StoreAction.runFlop(tick)(s);
  }

  if (isEndOfWeek(tick)) {
    StoreAction.runWeekReset(s);
  }
};

type Modifier = { expirationTick: number };
const expireModifiers = <T extends Modifier>(
  modMap: GuaranteedMap<string, T[]>,
  tick: number
): void => {
  for (const [key, mods] of modMap) {
    modMap.set(
      key,
      mods.filter(m => m.expirationTick > tick)
    );
  }
};

const isFlopPreview = (tick: number) => {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(FLOP_PREVIEW_POINT * TICKS_PER_WEEK);
};

const isWeekend = (tick: number) => {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(WEEKEND_START * TICKS_PER_WEEK) - 1;
};

const isEndOfWeek = (tick: number) => {
  return tick % TICKS_PER_WEEK === TICKS_PER_WEEK - 1;
};
