import React from "react";
import { stocks } from "../../store/mockData/stocks";
import Stock from "../render/Stock";

function Test() {
  const stock = stocks[0];
  return (
    <Stock
      name={stock.name}
      ticker={stock.ticker}
      priceHistory={stock.priceHistory}
      rankHistory={stock.rankHistory}
      pair={stock.pair}
      pairIsNew={false}
      playerCash={1_000_000}
      purchaseQuantities={[1000, 5000, 10000]}
    />
  );
}

export default Test;
