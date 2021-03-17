import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

type PropTypes = {
  quantities: number[];
  currentPrice: number;
  playerCash: number;
  disabled: boolean;
  onBuy: (qty: number) => void;
};

function BuyButtons({
  quantities,
  currentPrice,
  playerCash,
  disabled,
  onBuy,
}: PropTypes) {
  return (
    <HStack fullWidth>
      {quantities.map(qty => (
        <VStack w={"100%"} key={qty}>
          <Button
            size={"xs"}
            isFullWidth
            disabled={disabled || currentPrice * qty > playerCash}
            onClick={() => onBuy(qty)}
            key={`buy_${qty}`}
          >
            BUY {qty / 1000}K
          </Button>
          <Text fontSize={"sm"} color={"gray.500"}>
            {formatPriceEst(currentPrice * qty)}
          </Text>
        </VStack>
      ))}
    </HStack>
  );
}

function formatPriceEst(price: number) {
  if (price > 1_000_000) {
    return `~${(price / 1_000_000).toFixed(1)}M`;
  } else {
    return `~${Math.ceil(price / 1_000)}K`;
  }
}

export default BuyButtons;
