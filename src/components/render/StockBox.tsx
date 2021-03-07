import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { last, isNumber } from "lodash";
import React from "react";
import { TICKS_PER_WEEK } from "../../config";
import { formatCurrency } from "../../core/helpers";
import { Stock } from "../../core/stock/Stock";
import { useStore } from "../../store/store";
import CardStack from "./CardStack";
import PercentChange from "./PercentChange";
import StockGraph from "./StockGraph";

interface PropTypes {
  stock: Stock;
  playerCash?: number;
  purchaseQuantities?: number[];
  viewFullHistory?: boolean;
  disableTransactions?: boolean;
  onBuy?: (n: number, s: number) => void;
  onSell?: (n: number) => void;
}

function StockBox({
  stock,
  playerCash,
  purchaseQuantities,
  viewFullHistory = false,
  disableTransactions = true,
  onBuy,
}: PropTypes) {
  const tick = useStore(s => s.tick);
  const rankColor = stock.rank > 3 ? "red" : "green";

  const thisWeek = Math.floor(tick / TICKS_PER_WEEK); // TODO
  let slicedPriceHistory = stock.priceHistory;
  if (!viewFullHistory) {
    slicedPriceHistory = slicedPriceHistory.slice(thisWeek * TICKS_PER_WEEK);
  }

  const startPrice = slicedPriceHistory[0] || 0;
  const currentPrice = last(slicedPriceHistory) || 0;

  let buyBtns;
  if (purchaseQuantities && isNumber(playerCash)) {
    buyBtns = purchaseQuantities.map(qty => (
      <VStack w={"100%"}>
        <Button
          size={"xs"}
          colorScheme={"green"}
          w={"100%"}
          disabled={disableTransactions || currentPrice * qty > playerCash}
          onClick={() => onBuy && onBuy(qty, currentPrice)}
          key={`buy_${qty}`}
        >
          Buy {qty / 1000}K
        </Button>
        <Text fontSize={"sm"} color={"gray.500"}>
          {formatPriceEst(currentPrice * qty)}
        </Text>
      </VStack>
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
          <HStack spacing={3} fontWeight={"semibold"} fontSize={"xl"}>
            <Text display={"inline-block"}>{stock.name}</Text>
            <Text display={"inline-block"} color={"gray.500"} fontSize={"sm"}>
              ${stock.ticker}
            </Text>
          </HStack>
          <Flex
            fontSize={"md"}
            justify={"space-between"}
            align={"center"}
            width={"190px"}
          >
            <Text fontSize="xl">{formatCurrency(currentPrice)}</Text>
            <PercentChange start={startPrice} end={currentPrice} />
            <Tooltip label={stock.handDescr} aria-label="Hand ranking">
              <Text
                position="relative"
                color={`${rankColor}.600`}
                bg={`${rankColor}.100`}
                borderWidth={1}
                borderColor={`${rankColor}.500`}
                fontWeight={"bold"}
                textAlign={"center"}
                w={8}
                _hover={{ cursor: "default" }}
              >
                {stock.handBonus.length > 0 && (
                  <StarIcon
                    position="absolute"
                    color="yellow.400"
                    right={0}
                    transform="translate(50%, -50%)"
                    w="13px"
                    h="13px"
                  />
                )}
                {stock.rank}
              </Text>
            </Tooltip>
          </Flex>
        </Box>
        <CardStack
          cards={stock.pair.cards}
          highlightColor={stock.pairIsNew ? "red.500" : undefined}
          transform={"translateY(-50%)"}
          position={"absolute"}
          right={"0"}
        />
      </Flex>
      <Divider />
      <StockGraph
        priceHistory={slicedPriceHistory}
        viewFullHistory={viewFullHistory}
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

function formatPriceEst(price: number) {
  if (price > 1_000_000) {
    return `~${(price / 1_000_000).toFixed(1)}M`;
  } else {
    return `~${Math.ceil(price / 1_000)}K`;
  }
}

export default StockBox;
