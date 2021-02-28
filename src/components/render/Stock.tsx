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
import { stackRollMods } from "../../core/helpers";
import { TStock } from "../../core/stock/Stock";
import { usePrivateStore } from "../../store/privateStore";
import { useSharedStore } from "../../store/sharedStore";
import CardStack from "./CardStack";
import PercentChange from "./PercentChange";
import StockGraph from "./StockGraph";

interface PropTypes extends TStock {
  playerCash?: number;
  purchaseQuantities?: number[]; // temp
  disableTransactions?: boolean;
  onBuy?: (n: number, s: number) => void;
  onSell?: (n: number) => void;
}

function Stock({
  name,
  ticker,
  priceHistory,
  rankHistory,
  pair,
  pairIsNew,
  playerCash,
  purchaseQuantities,
  disableTransactions = true,
  onBuy,
}: PropTypes) {
  // TODO
  const tick = useSharedStore(s => s.tick);
  const isHost = usePrivateStore(s => s.isHost);
  const volModMap = usePrivateStore(s => s.stockVolatilityModifierMap);
  const rollModMap = usePrivateStore(s => s.stockRollModifierMap);

  const volatility =
    volModMap[ticker]?.map(m => m.value).reduce((a, b) => a + b, 0) +
    GENERAL_FLUCTUATION_MAX;

  // let marketClose = priceHistory.length >= TICKS_PER_GRAPH;
  const marketClose = true; // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const weekStartTick =
    (Math.floor(tick / TICKS_PER_WEEK) - 1) * TICKS_PER_WEEK;
  const startPrice = priceHistory[Math.max(weekStartTick, 0)] || 0;
  const currentPrice = last(priceHistory) || 0;

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
              {name}
            </Text>
            <Text display={"inline-block"} color={"gray.500"} fontSize={"sm"}>
              ${ticker}
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
          cards={pair.cards}
          highlightColor={pairIsNew ? "red.500" : undefined}
          transform={"translateY(-50%)"}
          position={"absolute"}
          right={"0"}
        />
      </Flex>
      {DEBUG && isHost && (
        <>
          <Divider />
          {volModMap[ticker] && (
            <div>
              <strong>Volatility:</strong>
              {(volatility * 100).toFixed(2)}%
            </div>
          )}
          {rollModMap[ticker] && (
            <div style={{ maxWidth: "300px" }}>
              <strong>Roll Mods:</strong>
              {JSON.stringify(stackRollMods(rollModMap[ticker]))}
            </div>
          )}
        </>
      )}
      <Divider />
      <StockGraph
        priceHistory={priceHistory}
        rankHistory={rankHistory}
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

function withCommas(x: number) {
  return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(x: number) {
  return "$" + withCommas(x);
}

function formatPriceEst(price: number) {
  if (price > 1_000_000) {
    return `~${(price / 1_000_000).toFixed(1)}M`;
  } else {
    return `~${Math.ceil(price / 1_000)}K`;
  }
}

export default Stock;
