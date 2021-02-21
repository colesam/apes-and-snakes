import { random } from "lodash";
import { Modifier } from "../../components/pages/Test";
import { GENERAL_FLUCTUATION_MAX, STOCK_PRICE_FLOOR } from "../../config";
import { Stock } from "./Stock";

const nextPrice = (priceHistory: number[], modifiers: Modifier[]): number => {
  const modMultipliers = modifiers.flatMap(m => m.multipliers || []);
  const volatility = Math.max(
    ...modifiers.map(m => m.volatility || 0),
    GENERAL_FLUCTUATION_MAX
  );

  const prevPrice = priceHistory[priceHistory.length - 1] || 0;
  // if (modifiers.length) console.log(modifiers);
  const multipliers = [-1, 1, ...modMultipliers];
  const mult =
    prevPrice > STOCK_PRICE_FLOOR
      ? multipliers[random(multipliers.length - 1)]
      : 1;
  const percent = random(0, volatility, true);
  return prevPrice + prevPrice * mult * percent;
};

export const tickPrice = (stock: Stock, modifiers: Modifier[]): Stock => {
  return stock.set({
    priceHistory: [
      ...stock.priceHistory,
      nextPrice(stock.priceHistory, modifiers),
    ],
  });
};
