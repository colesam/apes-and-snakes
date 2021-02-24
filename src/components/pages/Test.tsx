import {
  Box,
  Button,
  Flex,
  Table,
  Text,
  Tr,
  Thead,
  VStack,
  Tbody,
  Td,
  Th,
} from "@chakra-ui/react";
import { last, range } from "lodash";
import React, { useEffect, useState } from "react";
import {
  TICKS_PER_GRAPH,
  TICK_SPEED,
  TICKS_PER_WEEK,
  SIM_WEEKS,
  FLOP_PREVIEW_POINT,
  WEEKEND_START,
  BUY_MODIFIER_TICK_LIFETIME,
  BUY_ROLL_MODIFIER,
} from "../../config";
import { Position } from "../../core/stock/Position";
import { RollModifier } from "../../core/stock/RollModifier";
import { StoreAction } from "../../store/StoreAction";
import { players } from "../../store/mockData/players";
import { useSharedStore } from "../../store/sharedStore";
import PercentChange from "../render/PercentChange";
import StockRender from "../render/Stock";

const stockQtys = [1, 2, 10];

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
  if (isWeekend(tick)) StoreAction.applyFlop(tick);
}

function Test() {
  const [player, setPlayer] = useState(players[0]);
  const [tick, setTick] = useState(0);
  const stocks = useSharedStore(s => s.stocks);

  const stockPriceMap = stocks.reduce<{ [key: string]: number }>(
    (acc, stock) => {
      acc[stock.ticker] = last(stock.priceHistory) || 0;
      return acc;
    },
    {}
  );

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

  const handleBuy = (ticker: string, qty: number, price: number) => {
    const numMods = Math.floor(qty / 1000);

    StoreAction.pushRollModifiers(
      ticker,
      [...Array(numMods)].map(
        _ =>
          new RollModifier({
            value: BUY_ROLL_MODIFIER,
            expirationTick: tick + BUY_MODIFIER_TICK_LIFETIME,
          })
      )
    );

    setPlayer(
      player.set({
        positions: [
          ...player.positions,
          new Position({
            stockTicker: ticker,
            quantity: qty,
            purchasePrice: price,
          }),
        ],
      })
    );
  };

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
              onBuy={(qty, price) => handleBuy(stock.ticker, qty, price)}
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
        <Table variant="simple" size={"sm"} bg={"white"}>
          <Thead>
            <Tr>
              <Th w={100}>Stock</Th>
              <Th w={100}>Qty</Th>
              <Th w={"20%"}>Orig Value</Th>
              <Th w={"20%"}>Curr Value</Th>
              <Th>% Change</Th>
              <Th w={100}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {player.positions.map(pos => (
              <Tr key={pos.stockTicker + pos.purchasePrice}>
                <Td fontWeight={"bold"}>${pos.stockTicker}</Td>
                <Td>{pos.quantity / 1000}K</Td>
                <Td>{formatCurrency(pos.quantity * pos.purchasePrice)}</Td>
                <Td>
                  {formatCurrency(
                    pos.quantity * stockPriceMap[pos.stockTicker]
                  )}
                </Td>
                <Td>
                  <PercentChange
                    start={pos.purchasePrice}
                    end={stockPriceMap[pos.stockTicker]}
                  />
                </Td>
                <Td>
                  <Button size={"xs"} colorScheme={"red"} w={"100%"}>
                    SELL
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
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

export default Test;
