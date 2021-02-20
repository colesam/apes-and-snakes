import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Pair } from "../../core/card/Pair";
import CardStack from "./CardStack";

type PropTypes = {
  name: string;
  ticker: string;
  change: number;
  pair: Pair;
};

function Stock({ name, ticker, change, pair }: PropTypes) {
  return (
    <Box borderWidth={1} borderRadius={"md"} p={4} minWidth={300}>
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
    </Box>
  );
}

export default Stock;
