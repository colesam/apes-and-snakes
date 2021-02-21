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
import { ResponsiveLineCanvas as ResponsiveLine } from "@nivo/line";
import React from "react";
import { PRICE_TICKS_PER_DAY, ROUND_RANK_MODIFIERS } from "../../config";
import { RoundRank } from "../../core/poker";
import { TStock } from "../../core/stock/Stock";
import CardStack from "./CardStack";

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
  const priceData = priceHistory.map((price, i) => ({ x: i + 1, y: price }));
  const paddedRankHistory = [null, null, null].map(
    (_, i) => rankHistory[i] || null
  );
  let marketClose = priceData.length === PRICE_TICKS_PER_DAY + 1;
  let startPrice = 0;
  let endPrice = 0;
  let change = 0;
  if (marketClose) {
    startPrice = priceHistory[0];
    endPrice = priceHistory[priceHistory.length - 1];
    change = (endPrice - startPrice) / startPrice;
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
      <Flex justify={"space-between"}>
        <Box>
          <Text fontWeight={"semibold"} fontSize={"xl"}>
            {name}
          </Text>
          <Text color={"gray.500"}>${ticker}</Text>
        </Box>
        <CardStack cards={pair.cards} transform={"translateY(-50%)"} />
      </Flex>
      {marketClose && (
        <Flex justify={"space-between"}>
          <Flex
            align={"center"}
            color={change < 0 ? "red.500" : "green.500"}
            mr={8}
          >
            {(change * 100).toFixed(1)}%
            {change < 0 ? (
              <TriangleDownIcon ml={2} />
            ) : (
              <TriangleUpIcon ml={2} />
            )}
          </Flex>
          <Text>{"$" + startPrice.toFixed(2)}</Text>
          <Text fontWeight={"bold"} as={"kbd"}>
            {"=>"}
          </Text>
          <Text>{"$" + endPrice.toFixed(2)}</Text>
        </Flex>
      )}
      <Divider />
      <Flex justify={"space-around"} px={10}>
        {paddedRankHistory.map(roundRank => {
          let color = "gray";
          if (roundRank) {
            const mod = ROUND_RANK_MODIFIERS[roundRank][0];
            color = mod > 0 ? "green" : "red";
          }
          return (
            <Text
              color={`${color}.600`}
              bg={`${color}.100`}
              borderWidth={1}
              borderColor={`${color}.600`}
              fontWeight={"bold"}
              textAlign={"center"}
              w={8}
            >
              {roundRank || "-"}
            </Text>
          );
        })}
      </Flex>
      <Box h={"120px"} bg="#f6f6f6">
        <ResponsiveLine
          data={[{ id: "price", data: priceData }]}
          colors={"rgb(56, 161,105)"}
          xScale={{
            type: "linear",
            min: 1,
            max: PRICE_TICKS_PER_DAY,
          }}
          yScale={{
            type: "linear",
            max: Math.max(...priceHistory) + 50,
          }}
          yFormat=" >-.2f"
          curve={"cardinal"}
          enableGridX={true}
          enableGridY={false}
          gridXValues={[
            0.25 * PRICE_TICKS_PER_DAY,
            0.5 * PRICE_TICKS_PER_DAY,
            0.75 * PRICE_TICKS_PER_DAY,
          ]}
          enableArea={marketClose}
          axisLeft={null}
          axisBottom={null}
          lineWidth={2}
          pointSize={4}
          pointColor={{ theme: "background" }}
        />
      </Box>
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
