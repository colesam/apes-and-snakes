import { RollModifier } from "../../core/stock/RollModifier";
import { Stock } from "../../core/stock/Stock";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
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

export const pureTickStockPrices = (
  tick: number,
  stocks: Stock[],
  stockVolatilityModifierMap: { [key: string]: VolatilityModifier[] },
  stockRollModifierMap: { [key: string]: RollModifier[] }
) => {
  // Expire mods, TODO: this doesn't belong here
  stockVolatilityModifierMap = expireModifiers(
    tick,
    stockVolatilityModifierMap
  );
  stockRollModifierMap = expireModifiers(tick, stockRollModifierMap);

  // Update price
  stocks = stocks.map(stock => {
    const volMods = stockVolatilityModifierMap[stock.ticker] || [];
    const rollMods = stockRollModifierMap[stock.ticker] || [];
    return tickPrice(stock, volMods, rollMods);
  });

  // Return updates
  return { stocks, stockVolatilityModifierMap, stockRollModifierMap };
};

export const makeTickStockPrices = (
  _getShared: typeof getShared,
  _setShared: typeof setShared,
  _getPrivate: typeof getPrivate,
  _setPrivate: typeof setPrivate
) => (tick: number) => {
  const { stocks } = _getShared();
  let { stockVolatilityModifierMap, stockRollModifierMap } = _getPrivate();

  const updates = pureTickStockPrices(
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

export const tickStockPrices = makeTickStockPrices(
  getShared,
  setShared,
  getPrivate,
  setPrivate
);
