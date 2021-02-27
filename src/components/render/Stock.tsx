import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { last } from "lodash";
import React from "react";
import { DEBUG, GENERAL_FLUCTUATION_MAX } from "../../config";
import { TStock } from "../../core/stock/Stock";
import { usePrivateStore } from "../../store/privateStore";
import CardStack from "./CardStack";
import StockGraph from "./StockGraph";

interface PropTypes extends TStock {
  purchaseQuantities?: number[]; // temp
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
  purchaseQuantities,
  onBuy,
}: PropTypes) {
  // TODO
  const volModMap = usePrivateStore(s => s.stockVolatilityModifierMap);
  const rollModMap = usePrivateStore(s => s.stockRollModifierMap);

  const volatility =
    volModMap[ticker]?.map(m => m.value).reduce((a, b) => a + b, 0) +
    GENERAL_FLUCTUATION_MAX;

  if (volModMap[ticker]) {
    console.log("-- volModMap[ticker] --");
    console.log(volModMap[ticker]);
  }

  // let marketClose = priceHistory.length >= TICKS_PER_GRAPH;
  const marketClose = true; // TODO
  const startPrice = priceHistory[0] || 0;
  const endPrice = last(priceHistory) || 0;

  let buyBtns;
  if (purchaseQuantities) {
    buyBtns = purchaseQuantities.map(qty => (
      <Button
        size={"xs"}
        colorScheme={"green"}
        w={"100%"}
        onClick={() => onBuy && onBuy(qty, endPrice)}
        key={`buy_${qty}`}
      >
        Buy {qty / 1000}K
      </Button>
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
          <Text fontSize={"lg"}>{formatCurrency(endPrice)}</Text>
        </Box>
        <CardStack
          cards={pair.cards}
          highlightColor={pairIsNew ? "red.500" : undefined}
          transform={"translateY(-50%)"}
          position={"absolute"}
          right={"0"}
        />
      </Flex>
      {DEBUG && (
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
              {JSON.stringify(rollModMap[ticker].map(m => m.value))}
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

export default Stock;
