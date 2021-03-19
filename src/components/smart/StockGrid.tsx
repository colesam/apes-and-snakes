import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useCallback } from "react";
import { PeerAction } from "../../peer/PeerAction";
import { StoreSelector } from "../../store/StoreSelector";
import { setStore, useStore } from "../../store/store";
import StockBox from "./StockBox";

function StockGrid() {
  // Store state
  const tick = useStore(s => s.tick);
  const viewedPlayer = useStore(StoreSelector.viewedPlayer);
  const portfolio = useStore(StoreSelector.viewedPlayerPortfolio);
  const stocks = useStore(s => s.stocks);
  const sortStocks = useStore(s => s.sortStocks);
  const playerId = useStore(s => s.playerId);
  const highlightCards = useStore(s => s.highlightCards);
  const viewFullHistory = useStore(s => s.viewFullHistory);
  const hostPeerId = useStore(s => s.hostPeerId);
  const secretKey = useStore(s => s.secretKey);

  // Computed
  const isOwnPlayer = viewedPlayer?.id === playerId;
  const playerPortfolio = viewedPlayer?.getPortfolio(stocks);

  const sortedStocks = Array.from(stocks.values());
  if (sortStocks && playerPortfolio) {
    sortedStocks.sort(
      (a, b) =>
        playerPortfolio.getPortfolioPercent(b.ticker) -
        playerPortfolio.getPortfolioPercent(a.ticker)
    );
  }

  // Handlers
  const handleBuy = useCallback(
    (stockTicker: string, quantity: number, price: number) => {
      PeerAction.openPosition(
        hostPeerId,
        secretKey,
        stockTicker,
        quantity,
        price
      );
    },
    [hostPeerId, secretKey]
  );

  const handleRankMouseEnter = useCallback((stockTicker: string) => {
    setStore(s => {
      s.highlightCards = s.stocks.get(stockTicker)!.relevantFlopCards;
    });
  }, []);

  const handleRankMouseLeave = useCallback(() => {
    setStore(s => {
      s.highlightCards = [];
    });
  }, []);

  return (
    <Flex justify={"space-around"} flexWrap={"wrap"}>
      {sortedStocks.map(stock => (
        <motion.div layout transition={springTransition} key={stock.ticker}>
          <StockBox
            stock={stock}
            tick={tick}
            playerName={viewedPlayer?.name}
            playerCash={viewedPlayer?.cash}
            isOwnPlayer={isOwnPlayer}
            portfolioPercent={portfolio?.getPortfolioPercent(stock.ticker)}
            viewFullHistory={viewFullHistory}
            highlightCards={highlightCards}
            onBuy={handleBuy}
            onRankMouseEnter={handleRankMouseEnter}
            onRankMouseLeave={handleRankMouseLeave}
          />
        </motion.div>
      ))}
    </Flex>
  );
}

const springTransition = {
  type: "spring",
  duration: 0.2,
  damping: 25,
  stiffness: 120,
};

export default StockGrid;
