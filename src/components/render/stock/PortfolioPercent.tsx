import { Text } from "@chakra-ui/react";
import React from "react";

type PropTypes = {
  percent: number;
  isOwnPlayer: boolean;
  playerName: string;
};

function PortfolioPercent({ percent, isOwnPlayer, playerName }: PropTypes) {
  return (
    <Text
      fontSize={"sm"}
      as={"em"}
      sx={{
        // Want to take up space even if portfolio percent is 0
        visibility: percent < 0.01 ? "hidden" : "visible",
      }}
    >
      <strong>{Math.round(percent * 1000) / 10}%</strong> of{" "}
      {isOwnPlayer ? "your" : playerName + "'s"} portfolio
    </Text>
  );
}

export default PortfolioPercent;
