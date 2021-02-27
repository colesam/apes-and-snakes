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
import { TStock } from "../../core/stock/Stock";
import CardStack from "./CardStack";
import PercentChange from "./PercentChange";
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
          <Text fontWeight={"semibold"} fontSize={"xl"}>
            {name}
          </Text>
          <Text color={"gray.500"}>${ticker}</Text>
        </Box>
        <CardStack
          cards={pair.cards}
          highlightColor={pairIsNew ? "red.500" : undefined}
          transform={"translateY(-50%)"}
          position={"absolute"}
          right={"0"}
        />
      </Flex>
      <Flex justify={"space-between"}>
        <PercentChange start={startPrice} end={endPrice} />
        <Text>{"$" + startPrice.toFixed(2)}</Text>
        <Text fontWeight={"bold"} as={"kbd"}>
          {"=>"}
        </Text>
        <Text>{"$" + endPrice.toFixed(2)}</Text>
      </Flex>
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

export default Stock;
