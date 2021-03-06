import { random } from "lodash";
import {
  GENERAL_FLUCTUATION_MAX,
  RANK_ROLLS,
  STOCK_PRICE_FLOOR,
} from "../../config";
import { RollModifier } from "./RollModifier";
import { Stock } from "./Stock";
import { VolatilityModifier } from "./VolatilityModifier";

function roll(rolls: number[]) {
  return rolls[random(rolls.length - 1)];
}

const nextPrice = (
  currentPrice: number,
  additionalRolls: number[],
  volatilityMod: number
): number => {
  const volatility = volatilityMod + GENERAL_FLUCTUATION_MAX;

  const rollPool = [-1, 1, ...additionalRolls];

  const mult = currentPrice > STOCK_PRICE_FLOOR ? roll(rollPool) : 1;

  const percentChange = random(0, volatility, true) * mult;

  return currentPrice + currentPrice * percentChange;
};

export const tickPrice = (
  stock: Stock,
  volMods: VolatilityModifier[],
  rollMods: RollModifier[]
): Stock => {
  const additionalRolls = [
    ...stock.handBonus,
    ...RANK_ROLLS[stock.rank],
    ...rollMods.map(m => m.value),
  ];
  const volatilityModSum = volMods.reduce((a, b) => a + b.value, 0);
  return stock.set(s => {
    s.priceHistory.push(
      nextPrice(stock.price, additionalRolls, volatilityModSum)
    );
  });
};
