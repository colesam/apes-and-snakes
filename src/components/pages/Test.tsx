import React from "react";
import { stocks } from "../../store/mockData/stocks";
import StockBox from "../render/StockBox";

function Test() {
  const stock = stocks[0];
  return (
    <StockBox
      stock={stock}
      playerCash={1_000_000}
      purchaseQuantities={[1000, 5000, 10000]}
    />
  );
}

export default Test;
