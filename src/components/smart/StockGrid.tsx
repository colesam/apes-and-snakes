import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { StoreSelector } from "../../store/StoreSelector";
import { useStore } from "../../store/store";
import StockBox from "./StockBox";

function StockGrid() {
  // Store state
  const viewedPlayer = useStore(StoreSelector.viewedPlayer);
  const stocks = useStore(s => s.stocks);
  const sortStocks = useStore(s => s.sortStocks);

  // Computed
  const playerPortfolio = viewedPlayer?.getPortfolio(stocks);

  const sortedStocks = Array.from(stocks.values());
  if (sortStocks && playerPortfolio) {
    sortedStocks.sort(
      (a, b) =>
        playerPortfolio.getPortfolioPercent(b.ticker) -
        playerPortfolio.getPortfolioPercent(a.ticker)
    );
  }

  return (
    <Flex justify={"space-around"} flexWrap={"wrap"}>
      {sortedStocks.map(stock => (
        <motion.div layout transition={springTransition} key={stock.ticker}>
          <StockBox stock={stock} />
        </motion.div>
      ))}
    </Flex>
  );
}

const springTransition = {
  type: "spring",
  damping: 25,
  stiffness: 120,
};

export default StockGrid;
