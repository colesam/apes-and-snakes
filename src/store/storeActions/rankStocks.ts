import { Hand } from "../../core/card/Hand";
import { Pair } from "../../core/card/Pair";
import { mapPairsToRank, solve } from "../../core/poker";
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

    // Check for special hands
    const hand = new Hand({ pair: stock.pair, flop: s.flop });
    const [solvedHand] = solve([hand]);
    stock.handDescr = solvedHand.descr;
  }
};
