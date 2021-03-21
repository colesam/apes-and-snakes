import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";

function PercentChange({ start, end }: { start: number; end: number }) {
  const change = start > 0 ? (end - start) / start : 0;

  return (
    <Flex
      justify={"space-between"}
      align={"center"}
      color={change < 0 ? "red.500" : "green.500"}
      w={"65px"}
    >
      {change < 0 ? <TriangleDownIcon /> : <TriangleUpIcon />}
      <Text>{Math.abs(change * 100).toFixed(1)}%</Text>
    </Flex>
  );
}

export default PercentChange;
