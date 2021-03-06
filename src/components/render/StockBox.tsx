import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { last, isNumber } from "lodash";
import React from "react";
import { DEBUG, GENERAL_FLUCTUATION_MAX, TICKS_PER_WEEK } from "../../config";
import { formatCurrency, stackRollMods } from "../../core/helpers";
import { Stock } from "../../core/stock/Stock";
import { StoreSelector } from "../../store/StoreSelector";
import { useStore } from "../../store/store";
import CardStack from "./CardStack";
import PercentChange from "./PercentChange";
import StockGraph from "./StockGraph";

interface PropTypes {
  stock: Stock;
  playerCash?: number;
  purchaseQuantities?: number[];
  disableTransactions?: boolean;
  onBuy?: (n: number, s: number) => void;
  onSell?: (n: number) => void;
}

function StockBox({
  stock,
  playerCash,
  purchaseQuantities,
  disableTransactions = true,
  onBuy,
}: PropTypes) {
  // TODO
  const tick = useStore(s => s.tick);
  const isHost = useStore(s => s.isHost);
  const volMods = useStore(StoreSelector.getVolatilityModifiers(stock.ticker));
  const rollMods = useStore(StoreSelector.getRollModifiers(stock.ticker));

  const volatility =
    volMods.map(m => m.value).reduce((a, b) => a + b, 0) +
    GENERAL_FLUCTUATION_MAX;

  // let marketClose = priceHistory.length >= TICKS_PER_GRAPH;
  const marketClose = true; // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const weekStartTick =
    (Math.floor(tick / TICKS_PER_WEEK) - 1) * TICKS_PER_WEEK;
  const startPrice = stock.priceHistory[Math.max(weekStartTick, 0)] || 0;
  const currentPrice = last(stock.priceHistory) || 0;

  let buyBtns;
  if (purchaseQuantities && isNumber(playerCash)) {
    buyBtns = purchaseQuantities.map(qty => (
      <VStack w={"100%"}>
        <Button
          size={"xs"}
          colorScheme={"green"}
          w={"100%"}
          disabled={disableTransactions || currentPrice * qty > playerCash}
          onClick={() => onBuy && onBuy(qty, currentPrice)}
          key={`buy_${qty}`}
        >
          Buy {qty / 1000}K
        </Button>
        <Text fontSize={"sm"} color={"gray.500"}>
          {formatPriceEst(currentPrice * qty)}
        </Text>
      </VStack>
    ));
  }

  return (
    <VStack
      borderWidth={1}
      borderRadius={"md"}
      p={4}
      minWidth={350}
      mb={8}
      spacing={4}
      align={"stretch"}
    >
      <Flex justify={"space-between"} position={"relative"}>
        <Box>
          <Box fontWeight={"semibold"} fontSize={"xl"}>
            <Text display={"inline-block"} mr={4}>
              {stock.name}
            </Text>
            <Text display={"inline-block"} color={"gray.500"} fontSize={"sm"}>
              ${stock.ticker}
            </Text>
          </Box>
          <Flex
            fontSize={"md"}
            justify={"space-between"}
            align={"center"}
            width={"140px"}
          >
            <Text fontSize={"xl"}>{formatCurrency(currentPrice)}</Text>
            <PercentChange start={startPrice} end={currentPrice} />
          </Flex>
        </Box>
        <CardStack
          cards={stock.pair.cards}
          highlightColor={stock.pairIsNew ? "red.500" : undefined}
          transform={"translateY(-50%)"}
          position={"absolute"}
          right={"0"}
        />
      </Flex>
      {DEBUG && isHost && (
        <>
          <Divider />
          <div>
            <strong>Volatility:</strong>
            {(volatility * 100).toFixed(2)}%
          </div>
          <div style={{ maxWidth: "300px" }}>
            <strong>Roll Mods:</strong>
            {JSON.stringify(stackRollMods(rollMods))}
          </div>
        </>
      )}
      <Divider />
      <StockGraph
        priceHistory={stock.priceHistory}
        rankHistory={stock.rankHistory}
        marketClose={marketClose}
      />
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
