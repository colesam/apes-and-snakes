import { last } from "lodash";
import { TStore } from "../store";

export const stockPriceMap = (s: TStore) =>
  s.stocks.reduce<{ [key: string]: number }>((acc, stock) => {
    acc[stock.ticker] = last(stock.priceHistory) || 0;
    return acc;
  }, {});
