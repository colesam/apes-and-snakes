import { tickPrice } from "../../core/stock/tickPrice";
import { getPrivate, setPrivate } from "../privateStore";
import { getShared, setShared } from "../sharedStore";

type Modifier = { expirationTick: number };
type ModifierMap<T extends Modifier> = { [key: string]: T[] };

const expireModifiers = <T extends Modifier>(
  tick: number,
  modMap: ModifierMap<T>
): ModifierMap<T> =>
  Object.entries(modMap).reduce<ModifierMap<T>>((acc, [key, mods]) => {
    acc[key] = mods.filter(m => m.expirationTick > tick);
    return acc;
  }, {});

export const makeTickStockPrices = (
  _getShared: typeof getShared,
  _setShared: typeof setShared,
  _getPrivate: typeof getPrivate,
  _setPrivate: typeof setPrivate
) => (tick: number) => {
  const { stocks } = _getShared();
  let { stockVolatilityModifierMap, stockRollModifierMap } = _getPrivate();

  stockVolatilityModifierMap = expireModifiers(
    tick,
    stockVolatilityModifierMap
  );
  stockRollModifierMap = expireModifiers(tick, stockRollModifierMap);

  _setShared({
    stocks: stocks.map(stock => {
      const volMods = stockVolatilityModifierMap[stock.ticker] || [];
      const rollMods = stockRollModifierMap[stock.ticker] || [];
      return tickPrice(stock, volMods, rollMods);
    }),
  });
  _setPrivate({ stockVolatilityModifierMap, stockRollModifierMap });
};

export const tickStockPrices = makeTickStockPrices(
  getShared,
  setShared,
  getPrivate,
  setPrivate
);
