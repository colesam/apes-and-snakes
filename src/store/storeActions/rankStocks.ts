import { TStore } from "../store";

export const rankStocks = (s: TStore) => {
  // Sort by rank
  const stocksSortedByRank = [...s.stocks].sort(
    (a, b) => b.solvedHandRank - a.solvedHandRank
  );

  let currentStockRank = 1;
  let currentHandRank = stocksSortedByRank[0].solvedHandRank;
  for (const stock of stocksSortedByRank) {
    if (stock.solvedHandRank !== currentHandRank) {
      currentStockRank++;
      currentHandRank = stock.solvedHandRank;
    }
    // @ts-ignore - Guaranteed to be within RoundRank range
    stock.rankHistory.push(currentStockRank);
  }
};
