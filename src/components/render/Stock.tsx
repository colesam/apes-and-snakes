import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { ResponsiveLineCanvas as ResponsiveLine } from "@nivo/line";
import React from "react";
import { priceTicksPerDay } from "../../config";
import { TStock } from "../../core/stock/Stock";
import CardStack from "./CardStack";

interface PropTypes extends TStock {
  onBuy?: () => void;
  onSell?: () => void;
}

function Stock({
  name,
  ticker,
  change,
  priceHistory,
  pair,
  onBuy,
  onSell,
}: PropTypes) {
  const priceData = priceHistory.map((price, i) => ({ x: i + 1, y: price }));
  return (
    <Box borderWidth={1} borderRadius={"md"} p={4} minWidth={350} mb={8}>
      <Flex justify={"space-between"}>
        <Box>
          <Text fontWeight={"semibold"} fontSize={"xl"}>
            {name}
          </Text>
          <Text color={"gray.500"}>${ticker}</Text>
        </Box>
        <CardStack cards={pair.cards} transform={"translateY(-50%)"} />
      </Flex>
      <Flex align={"center"} color={change < 0 ? "red.500" : "green.500"}>
        {(change * 100).toFixed(1)}%
        {change < 0 ? <TriangleDownIcon ml={2} /> : <TriangleUpIcon ml={2} />}
      </Flex>
      <Box h={"120px"} mt={2} bg="#f6f6f6">
        <ResponsiveLine
          data={[{ id: "price", data: priceData }]}
          colors={"rgb(56, 161,105)"}
          xScale={{
            type: "linear",
            min: 1,
            max: priceTicksPerDay,
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
            0.25 * priceTicksPerDay,
            0.5 * priceTicksPerDay,
            0.75 * priceTicksPerDay,
          ]}
          enableArea={priceData.length === priceTicksPerDay + 1} // TODO
          axisLeft={null}
          axisBottom={null}
          lineWidth={2}
          pointSize={4}
          pointColor={{ theme: "background" }}
        />
      </Box>
      <HStack mt={4}>
        <Button colorScheme={"green"} w={"100%"} onClick={onBuy}>
          Buy
        </Button>
        <Button colorScheme={"blue"} w={"100%"} onClick={onSell}>
          Sell
        </Button>
      </HStack>
    </Box>
  );
}

export default Stock;
