import { Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { PURCHASE_QUANTITIES, TICKS_PER_WEEK } from "../../config";
import { formatCurrency, isWeekend } from "../../core/helpers";
import { Stock } from "../../core/stock/Stock";
import { PeerAction } from "../../peer/PeerAction";
import { StoreSelector } from "../../store/StoreSelector";
import { setStore, useStore } from "../../store/store";
import CardStack from "../render/CardStack";
import BuyButtons from "../render/stock/BuyButtons";
import PortfolioPercent from "../render/stock/PortfolioPercent";
import PriceGraph from "../render/stock/PriceGraph";
import Rank from "../render/stock/Rank";
import Volume from "../render/stock/Volume";

interface PropTypes {
  stock: Stock;
}

function StockBox({ stock }: PropTypes) {
  // Store state
  const tick = useStore(s => s.tick);
  const viewedPlayer = useStore(StoreSelector.viewedPlayer);
  const portfolio = useStore(StoreSelector.viewedPlayerPortfolio);
  const playerId = useStore(s => s.playerId);
  const highlightCards = useStore(s => s.highlightCards);
  const viewFullHistory = useStore(s => s.viewFullHistory);
  const hostPeerId = useStore(s => s.hostPeerId);
  const secretKey = useStore(s => s.secretKey);

  // Computed
  const isOwnPlayer = viewedPlayer?.id === playerId;

  let slicedPriceHistory = stock.priceHistory;
  if (!viewFullHistory) {
    const thisWeek = Math.floor(tick / TICKS_PER_WEEK);
    slicedPriceHistory = slicedPriceHistory.slice(thisWeek * TICKS_PER_WEEK);
  }

  // Handlers
  const handleRankMouseEnter = () => {
    setStore(s => {
      s.highlightCards = stock.relevantFlopCards;
    });
  };

  const handleRankMouseLeave = () => {
    setStore(s => {
      s.highlightCards = [];
    });
  };

  const handleBuy = (quantity: number) => {
    PeerAction.openPosition(
      hostPeerId,
      secretKey,
      stock.ticker,
      quantity,
      stock.price
    );
  };

  return (
    <VStack
      bg={"white"}
      borderWidth={1}
      borderRadius={"md"}
      p={4}
      minWidth={350}
      mb={8}
      spacing={4}
      align={"stretch"}
    >
      {/* General info section */}
      <Flex justify={"space-between"} position={"relative"}>
        <Box>
          <Text display={"inline-block"}>{stock.name}</Text>

          {/* Price and rank */}
          <Flex
            fontSize={"md"}
            justify={"space-between"}
            align={"center"}
            width={"190px"}
          >
            <Text fontSize="xl">{formatCurrency(stock.price)}</Text>
            <Rank
              rank={stock.rank}
              handDescription={stock.solvedHand?.descr}
              hasHandBonus={stock.handBonus.length > 0}
              onMouseEnter={handleRankMouseEnter}
              onMouseLeave={handleRankMouseLeave}
            />
          </Flex>

          {viewedPlayer && portfolio ? (
            <PortfolioPercent
              percent={portfolio.getPortfolioPercent(stock.ticker)}
              isOwnPlayer={isOwnPlayer}
              playerName={viewedPlayer.name}
            />
          ) : null}
        </Box>

        <CardStack
          cards={stock.pair.cards}
          alertCards={stock.newPairCards}
          highlightCards={highlightCards}
          transform={"translateY(-50%)"}
          position={"absolute"}
          right={"0"}
        />
      </Flex>

      <Divider />

      {/* Volume section */}
      <Flex justify="space-between">
        <Box w="48%">
          <Text fontWeight="bold" fontSize="sm">
            Buy Volume:
          </Text>
          <Volume volume={stock.buyVolume} />
        </Box>
        <Box w="48%">
          <Text fontWeight="bold" fontSize="sm">
            Sell Volume:
          </Text>
          <Volume volume={stock.sellVolume} />
        </Box>
      </Flex>

      <Divider />

      {/* Stock graph section */}
      <PriceGraph
        priceHistory={slicedPriceHistory}
        viewFullHistory={viewFullHistory}
      />

      {/* Purchase buttons section */}
      {viewedPlayer && isOwnPlayer ? (
        <>
          <Divider />
          <BuyButtons
            quantities={PURCHASE_QUANTITIES}
            currentPrice={stock.price}
            playerCash={viewedPlayer.cash}
            disabled={isWeekend(tick)}
            onBuy={qty => handleBuy(qty)}
          />
        </>
      ) : null}
    </VStack>
  );
}

export default StockBox;
