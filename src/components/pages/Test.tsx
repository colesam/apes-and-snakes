import { Box, Flex, Text } from "@chakra-ui/react";
import { range } from "lodash";
import React, { useEffect, useState } from "react";
import {
  TICKS_PER_GRAPH,
  ROUND_MODIFIER_TICK_LIFETIME,
  TICK_SPEED,
  TICKS_PER_WEEK,
  SIM_ROUNDS,
} from "../../config";
import { StoreAction } from "../../store/StoreAction";
import { useSharedStore } from "../../store/sharedStore";
import StockRender from "../render/Stock";

function isWeekend(tick: number) {
  const currentWeek = Math.floor(tick / TICKS_PER_WEEK) + 1;

  return (
    tick ===
    Math.ceil(currentWeek * TICKS_PER_WEEK - ROUND_MODIFIER_TICK_LIFETIME)
  );
}

function Test() {
  const [tick, setTick] = useState(0);
  const stocks = useSharedStore(s => s.stocks);

  useEffect(() => {
    // Simulate one day
    if (SIM_ROUNDS) {
      range(0, SIM_ROUNDS * TICKS_PER_WEEK).forEach(tick => {
        StoreAction.tickStockPrices(tick);
        if (isWeekend(tick)) StoreAction.applyFlop(tick);
      });
      setTick(SIM_ROUNDS * TICKS_PER_WEEK + 1);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (
        (!SIM_ROUNDS || tick > SIM_ROUNDS * TICKS_PER_WEEK) &&
        tick < TICKS_PER_GRAPH
      ) {
        StoreAction.tickStockPrices(tick);
        if (isWeekend(tick)) StoreAction.applyFlop(tick);
      }
      setTick(tick => tick + 1);
    }, TICK_SPEED);
    return () => clearInterval(id);
  }, [tick]);

  // Render
  return (
    <Box spacing={4} p={4} w={"95vw"} minHeight={"95vh"}>
      <Flex justify={"space-between"} flexWrap={"wrap"}>
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
  );
}

export default Test;
