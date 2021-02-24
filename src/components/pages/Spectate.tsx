import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { last, range } from "lodash";
import React, { useEffect } from "react";
import {
  TICKS_PER_GRAPH,
  TICK_SPEED,
  SIM_WEEKS,
  TICKS_PER_WEEK,
  WEEKEND_START,
} from "../../config";
import { StoreAction } from "../../store/StoreAction";
import { getShared, setShared, useSharedStore } from "../../store/sharedStore";
import StockRender from "../render/Stock";

function isWeekend(tick: number) {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(WEEKEND_START * TICKS_PER_WEEK);
}

function runTick(tick: number) {
  StoreAction.tickStockPrices(tick);
  if (isWeekend(tick)) StoreAction.applyFlop(tick);
}

function Spectate() {
  // Shared store
  const players = useSharedStore(s => s.players);
  const stocks = useSharedStore(s => s.stocks);

  const stockPriceMap = stocks.reduce<{ [key: string]: number }>(
    (acc, stock) => {
      acc[stock.ticker] = last(stock.priceHistory) || 0;
      return acc;
    },
    {}
  );

  // Effects
  useEffect(() => {
    // TODO: move
    // Simulate one day
    if (SIM_WEEKS) {
      range(0, SIM_WEEKS * TICKS_PER_WEEK).forEach(tick => {
        runTick(tick);
      });
      setShared(s => ({ tick: SIM_WEEKS * TICKS_PER_WEEK + 1 }));
    }
  }, []);

  useEffect(() => {
    // TODO: move
    const id = setInterval(() => {
      const { tick } = getShared();
      if (
        (!SIM_WEEKS || tick > SIM_WEEKS * TICKS_PER_WEEK) &&
        tick < TICKS_PER_GRAPH
      ) {
        runTick(tick);
      }
      StoreAction.incrementTick();
    }, TICK_SPEED);
    return () => clearInterval(id);
  }, []);

  // Render
  return (
    <Flex justify={"space-between"} w={"95vw"}>
      <Box p={4} w={"60%"} minHeight={"95vh"}>
        <Flex justify={"space-around"} flexWrap={"wrap"}>
          {stocks.map(stock => (
            <StockRender
              name={stock.name}
              ticker={stock.ticker}
              priceHistory={stock.priceHistory}
              rankHistory={stock.rankHistory}
              pair={stock.pair}
              key={stock.name}
            />
          ))}
        </Flex>
        <Text fontSize={"lg"} mb={8}>
          Time Per Turn:{" "}
          {(((TICK_SPEED / 1000) * TICKS_PER_GRAPH) / 60).toFixed(2)}
        </Text>
      </Box>
      <VStack
        spacing={8}
        align={"flex-start"}
        p={4}
        w={"40%"}
        minHeight={"95vh"}
      >
        TODO
      </VStack>
    </Flex>
  );
}

function withCommas(x: number) {
  return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(x: number) {
  return "$" + withCommas(x);
}

export default Spectate;
