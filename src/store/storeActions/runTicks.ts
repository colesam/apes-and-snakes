import { isStartOfWeek } from "../../core/helpers";
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
      s.stockVolatilityModifierMap.get(stock.ticker) || [],
      s.stockRollModifierMap.get(stock.ticker) || []
    )
  );

  // Updates at specific points of the week
  if (isStartOfWeek(tick)) {
    StoreAction.runWeekStart(tick)(s);
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
