import { calculateStockRankMap, RoundRank } from "../../core/poker";
import { TStore } from "../store";

export const rankStocks = (s: TStore) => {
  const stockRankMap = calculateStockRankMap(s.stocks, s.flop);
  for (const stock of s.stocks.values()) {
    if (!stockRankMap.has(stock.ticker)) {
      throw new Error(`Stock #${stock.ticker} not found in stockRankMap.`);
    }
    stock.rankHistory.push(stockRankMap.get(stock.ticker) as RoundRank);
  }
};
