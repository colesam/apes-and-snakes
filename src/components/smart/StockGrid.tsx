import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useCallback, useEffect } from "react";
import { Stock } from "../../core/stock/Stock";
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
  const expandStockTicker = useStore(s => s.expandStockTicker);

  // Computed
  const isOwnPlayer = viewedPlayer?.id === playerId;
  const playerPortfolio = viewedPlayer?.getPortfolio(stocks);

  let stockList: Stock[] = Array.from(stocks.values());
  if (expandStockTicker) {
    stockList = stockList.filter(stock => stock.ticker === expandStockTicker);
  } else if (sortStocks && playerPortfolio) {
    stockList.sort(
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

  const handleCompactStockClick = useCallback((stockTicker: string) => {
    // ...
    setStore({ expandStockTicker: stockTicker });
  }, []);

  const handleEscapeKeyPress = useCallback(e => {
    if (e.key === "Escape") {
      setStore({ expandStockTicker: null });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKeyPress);
    return () => document.removeEventListener("keydown", handleEscapeKeyPress);
  }, []);

  return (
    // Eventually want to detect if user needs scroll, and then permanently enable scroll bar to avoid jittery animations
    <Flex justify={"space-around"} flexWrap={"wrap"}>
      {stockList.map(stock => (
        <motion.div
          layout={"position"}
          transition={springTransition}
          key={stock.ticker}
        >
          <StockBox
            isCompact={expandStockTicker !== stock.ticker}
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
            onCompactClick={handleCompactStockClick}
          />
        </motion.div>
      ))}
    </Flex>
  );
}

const springTransition = {
  type: "tween",
  duration: 0.3,
  ease: "easeInOut",
};

export default StockGrid;
