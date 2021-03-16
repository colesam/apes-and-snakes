import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { last, isNumber } from "lodash";
import React from "react";
import { TICKS_PER_WEEK } from "../../config";
import { formatCurrency } from "../../core/helpers";
import { Stock } from "../../core/stock/Stock";
import { setStore, useStore } from "../../store/store";
import CardStack from "../render/CardStack";
import PercentChange from "../render/PercentChange";
import StockGraph from "../render/StockGraph";
import Volume from "../render/stock/Volume";

interface PropTypes {
  stock: Stock;
  isOwnPlayer?: boolean;
  playerName?: string;
  portfolioPercent?: number;
  playerCash?: number;
  purchaseQuantities?: number[];
  viewFullHistory?: boolean;
  disableTransactions?: boolean;
  onBuy?: (n: number, s: number) => void;
  onSell?: (n: number) => void;
}

function StockBox({
  stock,
  isOwnPlayer = false,
  playerName,
  portfolioPercent,
  playerCash,
  purchaseQuantities,
  viewFullHistory = false,
  disableTransactions = true,
  onBuy,
}: PropTypes) {
  const tick = useStore(s => s.tick);
  const highlightCards = useStore(s => s.highlightCards);
  const rankColor = stock.rank > 3 ? "red" : "green";

  const thisWeek = Math.floor(tick / TICKS_PER_WEEK); // TODO
  let slicedPriceHistory = stock.priceHistory;
  if (!viewFullHistory) {
    slicedPriceHistory = slicedPriceHistory.slice(thisWeek * TICKS_PER_WEEK);
  }

  const startPrice = slicedPriceHistory[0] || 0;
  const currentPrice = last(slicedPriceHistory) || 0;

  let buyBtns;
  if (purchaseQuantities && isNumber(playerCash)) {
    buyBtns = purchaseQuantities.map(qty => (
      <VStack w={"100%"} key={qty}>
        <Button
          size={"xs"}
          isFullWidth
          disabled={disableTransactions || currentPrice * qty > playerCash}
          onClick={() => onBuy && onBuy(qty, currentPrice)}
          key={`buy_${qty}`}
        >
          BUY {qty / 1000}K
        </Button>
        <Text fontSize={"sm"} color={"gray.500"}>
          {formatPriceEst(currentPrice * qty)}
        </Text>
      </VStack>
    ));
  }

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
          <HStack spacing={3} fontWeight={"semibold"} fontSize={"xl"}>
            <Text display={"inline-block"}>{stock.name}</Text>
            <Text display={"inline-block"} color={"gray.500"} fontSize={"sm"}>
              ${stock.ticker}
            </Text>
          </HStack>
          <Flex
            fontSize={"md"}
            justify={"space-between"}
            align={"center"}
            width={"190px"}
          >
            <Text fontSize="xl">{formatCurrency(currentPrice)}</Text>
            <PercentChange start={startPrice} end={currentPrice} />
            <Tooltip
              label={stock.solvedHand?.descr || " - "}
              aria-label="Hand ranking"
            >
              <Text
                position="relative"
                color={`${rankColor}.600`}
                bg={`${rankColor}.100`}
                borderWidth={1}
                borderColor={`${rankColor}.500`}
                fontWeight={"bold"}
                textAlign={"center"}
                w={8}
                _hover={{ cursor: "default" }}
                onMouseEnter={() =>
                  setStore(s => {
                    s.highlightCards = stock.relevantFlopCards;
                  })
                }
                onMouseLeave={() =>
                  setStore(s => {
                    s.highlightCards = [];
                  })
                }
              >
                {stock.handBonus.length > 0 && (
                  <StarIcon
                    position="absolute"
                    color="yellow.400"
                    right={0}
                    transform="translate(50%, -50%)"
                    w="13px"
                    h="13px"
                  />
                )}
                {stock.rank}
              </Text>
            </Tooltip>
          </Flex>
          {portfolioPercent != null ? (
            <Text
              fontSize={"sm"}
              as={"em"}
              sx={{
                visibility: portfolioPercent < 0.01 ? "hidden" : "visible",
              }}
            >
              <strong>{Math.round(portfolioPercent * 1000) / 10}%</strong> of{" "}
              {isOwnPlayer ? "your" : playerName + "'s"} portfolio
            </Text>
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
      <StockGraph
        priceHistory={slicedPriceHistory}
        viewFullHistory={viewFullHistory}
      />

      {/* Purchase buttons section */}
      {buyBtns && (
        <>
          <Divider />
          <HStack w={"100%"}>{buyBtns}</HStack>
        </>
      )}
    </VStack>
  );
}

function formatPriceEst(price: number) {
  if (price > 1_000_000) {
    return `~${(price / 1_000_000).toFixed(1)}M`;
  } else {
    return `~${Math.ceil(price / 1_000)}K`;
  }
}

export default StockBox;
