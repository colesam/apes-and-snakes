import { random, last } from "lodash";
import { GENERAL_FLUCTUATION_MAX, STOCK_PRICE_FLOOR } from "../../config";
import { RollModifier } from "./RollModifier";
import { Stock } from "./Stock";
import { VolitilityModifier } from "./VolitilityModifier";

function roll(rolls: number[]) {
  return rolls[random(rolls.length - 1)];
}

const nextPrice = (
  priceHistory: number[],
  volMods: VolitilityModifier[],
  rollMods: RollModifier[]
): number => {
  const volatility = Math.max(
    ...volMods.map(m => m.value),
    GENERAL_FLUCTUATION_MAX
  );

  const rollPool = [-1, 1, ...rollMods.map(m => m.value)];

  const prevPrice = last(priceHistory) || 0;
  const mult = prevPrice > STOCK_PRICE_FLOOR ? roll(rollPool) : 1;

  const percentChange = random(0, volatility, true) * mult;

  return prevPrice + prevPrice * percentChange;
};

export const tickPrice = (
  stock: Stock,
  volMods: VolitilityModifier[],
  rollMods: RollModifier[]
): Stock => {
  return stock.set({
    priceHistory: [
      ...stock.priceHistory,
      nextPrice(stock.priceHistory, volMods, rollMods),
    ],
  });
};
