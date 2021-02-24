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
import { RollModifier } from "../../core/stock/RollModifier";
import { Stock } from "../../core/stock/Stock";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { getPrivate, setPrivate } from "../../store/privateStore";
import { getShared, setShared, useSharedStore } from "../../store/sharedStore";
import { pureApplyFlop } from "../../store/storeActions/applyFlop";
import { pureTickStockPrices } from "../../store/storeActions/tickStockPrices";
import StockRender from "../render/Stock";

function isWeekend(tick: number) {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(WEEKEND_START * TICKS_PER_WEEK);
}

function runTick(
  tick: number,
  stocks: Stock[],
  stockVolatilityModifierMap: { [key: string]: VolatilityModifier[] },
  stockRollModifierMap: { [key: string]: RollModifier[] }
) {
  let updates = pureTickStockPrices(
    tick,
    stocks,
    stockVolatilityModifierMap,
    stockRollModifierMap
  );

  if (isWeekend(tick)) {
    updates = pureApplyFlop(
      tick,
      updates.stocks,
      updates.stockVolatilityModifierMap,
      updates.stockRollModifierMap
    );
  }

  return updates;
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
      const { stocks } = getShared();
      const { stockVolatilityModifierMap, stockRollModifierMap } = getPrivate();
      let updates = {
        stocks,
        stockVolatilityModifierMap,
        stockRollModifierMap,
      };

      range(0, SIM_WEEKS * TICKS_PER_WEEK).forEach(tick => {
        updates = runTick(
          tick,
          updates.stocks,
          updates.stockVolatilityModifierMap,
          updates.stockRollModifierMap
        );
      });

      setShared(s => ({
        tick: SIM_WEEKS * TICKS_PER_WEEK + 1,
        stocks: updates.stocks,
      }));
      setPrivate({
        stockVolatilityModifierMap: updates.stockVolatilityModifierMap,
        stockRollModifierMap: updates.stockRollModifierMap,
      });
    }
  }, []);

  useEffect(() => {
    // TODO: move
    const id = setInterval(() => {
      const { tick, stocks } = getShared();
      const { stockVolatilityModifierMap, stockRollModifierMap } = getPrivate();
      if (
        (!SIM_WEEKS || tick > SIM_WEEKS * TICKS_PER_WEEK) &&
        tick < TICKS_PER_GRAPH
      ) {
        const updates = runTick(
          tick,
          stocks,
          stockVolatilityModifierMap,
          stockRollModifierMap
        );
        setShared({ tick: tick + 1, stocks: updates.stocks });
        setPrivate({
          stockVolatilityModifierMap: updates.stockVolatilityModifierMap,
          stockRollModifierMap: updates.stockRollModifierMap,
        });
      }
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
