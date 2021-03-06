import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import React from "react";

function PercentChange({ start, end }: { start: number; end: number }) {
  const change = start > 0 ? (end - start) / start : 0;

  return (
    <Flex align={"center"} color={change < 0 ? "red.500" : "green.500"}>
      {Math.abs(change * 100).toFixed(1)}%
      {change < 0 ? <TriangleDownIcon ml={2} /> : <TriangleUpIcon ml={2} />}
    </Flex>
  );
}

export default PercentChange;
