import { Pair } from "../../core/card/Pair";
import { mapPairsToRank } from "../../core/poker";
import { TStore } from "../store";

export const rankStocks = (s: TStore) => {
  const stockPairMap = s.stocks.reduce<{ [key: string]: Pair }>(
    (acc, stock) => {
      acc[stock.ticker] = stock.pair;
      return acc;
    },
    {}
  );

  const stockRankMap = mapPairsToRank(stockPairMap, s.flop);
  for (const stock of s.stocks) {
    stock.rankHistory.push(stockRankMap[stock.ticker]);
  }
};
