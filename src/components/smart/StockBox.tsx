import { Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import moize from "moize";
import React, { useCallback } from "react";
import { PURCHASE_QUANTITIES, TICKS_PER_WEEK } from "../../config";
import { Card } from "../../core/card/Card";
import { formatCurrency, isWeekend } from "../../core/helpers";
import { Stock } from "../../core/stock/Stock";
import CardStack from "../render/CardStack";
import BuyButtons from "../render/stock/BuyButtons";
import PortfolioPercent from "../render/stock/PortfolioPercent";
import PriceGraph from "../render/stock/PriceGraph";
import Rank from "../render/stock/Rank";
import VolumeSection from "../render/stock/VolumeSection";

interface PropTypes {
  stock: Stock;
  tick: number;
  playerName?: string;
  playerCash?: number;
  isOwnPlayer?: boolean;
  portfolioPercent?: number;
  viewFullHistory: boolean;
  highlightCards?: Card[];
  onBuy: (stockTicker: string, quantity: number, price: number) => void;
  onRankMouseEnter: (stockTicker: string) => void;
  onRankMouseLeave: () => void;
}

function StockBox({
  stock,
  tick,
  playerName,
  playerCash,
  isOwnPlayer = false,
  portfolioPercent,
  viewFullHistory,
  highlightCards = [],
  onBuy,
  onRankMouseEnter,
  onRankMouseLeave,
}: PropTypes) {
  // Computed
  let slicedPriceHistory = stock.priceHistory;
  if (!viewFullHistory) {
    const thisWeek = Math.floor(tick / TICKS_PER_WEEK);
    slicedPriceHistory = slicedPriceHistory.slice(thisWeek * TICKS_PER_WEEK);
  }

  // Handlers
  const handleBuy = useCallback(
    (quantity: number) => {
      onBuy(stock.ticker, quantity, stock.price);
    },
    [stock]
  );

  const handleRankMouseEnter = useCallback(() => {
    onRankMouseEnter(stock.ticker);
  }, [stock]);

  return (
    <VStack
      bg={"white"}
      borderWidth={1}
      borderRadius={"md"}
      p={4}
      minWidth={350}
      mb={8}
      spacing={2}
      align={"stretch"}
      position={"relative"}
    >
      {/* General info section */}
      <Flex justify={"space-between"} align={"start"}>
        <Box>
          <Flex align={"center"}>
            <Text
              fontSize={"2xl"}
              fontWeight={"bold"}
              display={"inline-block"}
              mr={4}
            >
              {stock.name}
            </Text>
            <Rank
              rank={stock.rank}
              handDescription={stock.solvedHand?.descr}
              hasHandBonus={stock.handBonus.length > 0}
              onMouseEnter={handleRankMouseEnter}
              onMouseLeave={onRankMouseLeave}
            />
          </Flex>

          {/* Price and rank */}
          <Flex
            fontSize={"md"}
            justify={"space-between"}
            align={"center"}
            w={"100%"}
            mb={2}
          >
            <Text fontSize="xl">{formatCurrency(stock.price)}</Text>
          </Flex>

          {playerName && portfolioPercent ? (
            <PortfolioPercent
              percent={portfolioPercent}
              isOwnPlayer={isOwnPlayer}
              playerName={playerName}
            />
          ) : null}
        </Box>
        <CardStack
          cards={stock.pair.cards}
          alertCards={stock.newPairCards}
          highlightCards={highlightCards}
          cardScale={1.2}
          p={1}
          spacing={6}
        />
      </Flex>

      <Divider />

      <VolumeSection
        buyVolume={stock.buyVolume}
        sellVolume={stock.sellVolume}
      />

      <Divider />

      {/* Stock graph section */}
      <PriceGraph
        priceHistory={slicedPriceHistory}
        viewFullHistory={viewFullHistory}
      />

      {/* Purchase buttons section */}
      {playerName && playerCash && isOwnPlayer ? (
        <>
          <Divider />
          <BuyButtons
            quantities={PURCHASE_QUANTITIES}
            currentPrice={stock.price}
            playerCash={playerCash}
            disabled={isWeekend(tick)}
            onBuy={handleBuy}
          />
        </>
      ) : null}
    </VStack>
  );
}

export default moize(StockBox, { isReact: true, profileName: "<StockBox />" });
