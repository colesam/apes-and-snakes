import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { TICKS_PER_GRAPH } from "../../config";
import { RoundRank } from "../../core/poker";
import { TStock } from "../../core/stock/Stock";
import CardStack from "./CardStack";
import StockGraph from "./StockGraph";

interface PropTypes extends TStock {
  rankHistory: (RoundRank | null)[];
  onBuy?: () => void;
  onSell?: () => void;
}

function Stock({
  name,
  ticker,
  priceHistory,
  rankHistory,
  pair,
  onBuy,
  onSell,
}: PropTypes) {
  let marketClose = priceHistory.length > TICKS_PER_GRAPH;
  const startPrice = priceHistory[0] || 0;
  const endPrice = priceHistory[priceHistory.length - 1];
  const change = (endPrice - startPrice) / startPrice;
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
      <Flex justify={"space-between"}>
        <Box>
          <Text fontWeight={"semibold"} fontSize={"xl"}>
            {name}
          </Text>
          <Text color={"gray.500"}>${ticker}</Text>
        </Box>
        <CardStack cards={pair.cards} transform={"translateY(-50%)"} />
      </Flex>
      <Flex justify={"space-between"}>
        <Flex
          align={"center"}
          color={change < 0 ? "red.500" : "green.500"}
          mr={8}
        >
          {(change * 100).toFixed(1)}%
          {change < 0 ? <TriangleDownIcon ml={2} /> : <TriangleUpIcon ml={2} />}
        </Flex>
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
      <Divider />
      <HStack mt={4}>
        <Button colorScheme={"green"} w={"100%"} onClick={onBuy}>
          Buy
        </Button>
        <Button colorScheme={"blue"} w={"100%"} onClick={onSell}>
          Sell
        </Button>
      </HStack>
    </VStack>
  );
}

export default Stock;
