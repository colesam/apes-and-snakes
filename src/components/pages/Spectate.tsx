import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { last } from "lodash";
import React, { useEffect } from "react";
import { TICK_SPEED, SIM_WEEKS, TICKS_PER_WEEK, NUM_WEEKS } from "../../config";
import { StoreAction } from "../../store/StoreAction";
import { getStore, useStore } from "../../store/store";
import FlopDisplay from "../render/FlopDisplay";
import StockRender from "../render/Stock";

function Spectate() {
  // Shared store
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const players = useStore(s => s.players);
  const stocks = useStore(s => s.stocks);
  const flopDisplay = useStore(s => s.flopDisplay);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stockPriceMap = stocks.reduce<{ [key: string]: number }>(
    (acc, stock) => {
      acc[stock.ticker] = last(stock.priceHistory) || 0;
      return acc;
    },
    {}
  );

  // Effects
  useEffect(() => {
    StoreAction.setupGame();
    const id = setInterval(() => {
      const { tick } = getStore();
      if (
        (!SIM_WEEKS || tick >= SIM_WEEKS * TICKS_PER_WEEK) &&
        tick < NUM_WEEKS * TICKS_PER_WEEK
      ) {
        StoreAction.runTicks(1);
      }
    }, TICK_SPEED);
    return () => clearInterval(id);
  }, []);

  // Render
  return (
    <Flex
      justify={"space-between"}
      w={"100vw"}
      h={"100vh"}
      bg={"white"}
      color={"black"}
    >
      <Box p={4} w={"60%"}>
        <Flex justify={"center"} mb={10}>
          <FlopDisplay
            cards={flopDisplay ? flopDisplay.cards : []}
            spacing={8}
            cardScale={1.4}
          />
        </Flex>
        <Flex justify={"space-around"} flexWrap={"wrap"}>
          {stocks.map(stock => (
            <StockRender
              name={stock.name}
              ticker={stock.ticker}
              priceHistory={stock.priceHistory}
              rankHistory={stock.rankHistory}
              pair={stock.pair}
              pairIsNew={stock.pairIsNew}
              key={stock.name}
            />
          ))}
        </Flex>
        <Text fontSize={"lg"} mb={8}>
          Time Per Week:{" "}
          {(((TICK_SPEED / 1000) * TICKS_PER_WEEK) / 60).toFixed(2)}
        </Text>
        {/*Restart game without booting all players, etc.*/}
        <Button colorScheme={"red"} onClick={StoreAction.setupGame}>
          Reset
        </Button>
      </Box>
      <VStack spacing={8} align={"flex-start"} p={4} w={"40%"}>
        TODO
      </VStack>
    </Flex>
  );
}

function withCommas(x: number) {
  return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatCurrency(x: number) {
  return "$" + withCommas(x);
}

export default Spectate;
