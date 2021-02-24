import { Box, Flex, Text } from "@chakra-ui/react";
import { range } from "lodash";
import React, { useEffect, useState } from "react";
import {
  TICKS_PER_GRAPH,
  TICK_SPEED,
  TICKS_PER_WEEK,
  SIM_WEEKS,
  FLOP_PREVIEW_POINT,
  WEEKEND_START,
  BUY_MODIFIER_TICK_LIFETIME,
  BUY_PRICE_MODIFIER,
  SELL_PRICE_MODIFIER,
} from "../../../config";
import { RollModifier } from "../../../core/stock/RollModifier";
import { StoreAction } from "../../../store/StoreAction";
import { getShared, useSharedStore } from "../../../store/sharedStore";
import StockRender from "../../render/Stock";

const SIM_TRANSACTIONS = 1;

function isWeekend(tick: number) {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(WEEKEND_START * TICKS_PER_WEEK);
}

function isFlopPreview(tick: number) {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(FLOP_PREVIEW_POINT * TICKS_PER_WEEK);
}

function runTick(tick: number) {
  StoreAction.tickStockPrices(tick);
  if (isFlopPreview(tick)) {
    console.log(`[DEBUG] Pushing mod`);
    // Simulate effect buys and sells have on price
    getShared().stocks.forEach(stock => {
      const value =
        Math.random() < 0.5 ? BUY_PRICE_MODIFIER : SELL_PRICE_MODIFIER;
      for (let i = 0; i < SIM_TRANSACTIONS; i++) {
        StoreAction.pushRollModifiers(stock.ticker, [
          new RollModifier({
            expirationTick: tick + BUY_MODIFIER_TICK_LIFETIME,
            value,
          }),
        ]);
      }
    });
  }
  if (isWeekend(tick)) StoreAction.applyFlop(tick);
}

function BiweeklyTest() {
  const [tick, setTick] = useState(0);
  const stocks = useSharedStore(s => s.stocks);

  useEffect(() => {
    StoreAction.resetStores();
    // Simulate one day
    if (SIM_WEEKS) {
      range(0, SIM_WEEKS * TICKS_PER_WEEK).forEach(tick => {
        runTick(tick);
      });
      setTick(SIM_WEEKS * TICKS_PER_WEEK + 1);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (
        (!SIM_WEEKS || tick > SIM_WEEKS * TICKS_PER_WEEK) &&
        tick < TICKS_PER_GRAPH
      ) {
        runTick(tick);
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

export default BiweeklyTest;
