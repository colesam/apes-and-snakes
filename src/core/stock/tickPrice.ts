import { random } from "lodash";
import { GENERAL_FLUCTUATION_MAX, STOCK_PRICE_FLOOR } from "../../config";
import { Stock } from "./Stock";

const nextPrice = (priceHistory: number[], modifiers: number[]): number => {
  const prevPrice = priceHistory[priceHistory.length - 1] || 0;
  if (modifiers.length) console.log(modifiers);
  const multipliers = [-1, 1, ...modifiers];
  const mult =
    prevPrice > STOCK_PRICE_FLOOR
      ? multipliers[random(multipliers.length - 1)]
      : 1;
  const percent = random(0, GENERAL_FLUCTUATION_MAX, true);
  return prevPrice + prevPrice * mult * percent;
};

export const tickPrice = (stock: Stock, modifiers: number[]): Stock => {
  return stock.set({
    priceHistory: [
      ...stock.priceHistory,
      nextPrice(stock.priceHistory, modifiers),
    ],
  });
};
