import { random } from "lodash";
import {
  GENERAL_FLUCTUATION_MAX,
  RANK_ROLLS,
  STOCK_PRICE_FLOOR,
} from "../../config";
import { stackRollMods } from "../helpers";
import { RoundRank } from "../poker";
import { RollModifier } from "./RollModifier";
import { Stock } from "./Stock";
import { VolatilityModifier } from "./VolatilityModifier";

function roll(rolls: number[]) {
  return rolls[random(rolls.length - 1)];
}

const nextPrice = (
  currentPrice: number,
  currentRank: RoundRank,
  volMods: VolatilityModifier[],
  rollMods: RollModifier[]
): number => {
  const volatility =
    volMods.map(m => m.value).reduce((a, b) => a + b, 0) +
    GENERAL_FLUCTUATION_MAX;

  const rollPool = [
    -1,
    1,
    ...RANK_ROLLS[currentRank],
    ...stackRollMods(rollMods),
  ];

  const mult = currentPrice > STOCK_PRICE_FLOOR ? roll(rollPool) : 1;

  const percentChange = random(0, volatility, true) * mult;

  return currentPrice + currentPrice * percentChange;
};

export const tickPrice = (
  stock: Stock,
  volMods: VolatilityModifier[],
  rollMods: RollModifier[]
): Stock => {
  return stock.set(s => {
    s.priceHistory.push(nextPrice(stock.price, stock.rank, volMods, rollMods));
  });
};
