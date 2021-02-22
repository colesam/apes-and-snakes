import { Box, Flex, Text } from "@chakra-ui/react";
import { range } from "lodash";
import React, { useEffect, useState } from "react";
import {
  BUY_MODIFIER_TICK_LIFETIME,
  BUY_PRICE_MODIFIER,
  TICKS_PER_GRAPH,
  ROUND_FLUCTUATION_MAX,
  ROUND_RANK_MODIFIERS,
  ROUND_MODIFIER_TICK_LIFETIME,
  SELL_MODIFIER_TICK_LIFETIME,
  SELL_PRICE_MODIFIER,
  TICK_SPEED,
  NUM_ROUNDS,
  TICKS_PER_WEEK,
  SIM_ROUNDS,
} from "../../config";
import { Pair } from "../../core/card/Pair";
import { mapPairsToRank, RoundRank } from "../../core/poker";
import { Stock } from "../../core/stock/Stock";
import { tickPrice } from "../../core/stock/tickPrice";
import { stocks as stockData, deck } from "../../store/mockData/stocks";
import StockRender from "../render/Stock";
import { useMergeState } from "../useMergeState";

type StockState = {
  stocks: Stock[];
  priceMods: PriceModifierMap;
  ranks: RoundRankMap;
};

function Test() {
  const [tick, setTick] = useState(0);
  const [stockState, setStockState] = useMergeState<StockState>({
    stocks: stockData,
    priceMods: stockData.reduce<PriceModifierMap>((acc, { ticker }) => {
      acc[ticker] = [];
      return acc;
    }, {}),
    ranks: stockData.reduce<RoundRankMap>((acc, { ticker }) => {
      acc[ticker] = [];
      return acc;
    }, {}),
  });

  useEffect(() => {
    // Simulate one day
    if (SIM_ROUNDS) {
      range(0, SIM_ROUNDS * TICKS_PER_WEEK).forEach(tick => {
        setStockState((s: StockState) =>
          handleTick(tick, s.stocks, s.priceMods, s.ranks)
        );
        setTick(SIM_ROUNDS * TICKS_PER_WEEK + 1);
      });
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (tick > TICKS_PER_WEEK && tick < TICKS_PER_GRAPH) {
        setStockState((s: StockState) =>
          handleTick(tick, s.stocks, s.priceMods, s.ranks)
        );
        setTick(tick => tick + 1);
      }
    }, TICK_SPEED);
    return () => clearInterval(id);
  }, [tick]);

  const pushModifier = (
    ticker: string,
    modifier: Modifier,
    lifetime: number
  ) => {
    setStockState(s => ({
      ...s,
      priceMods: {
        ...s.priceMods,
        [ticker]: [
          ...s.priceMods[ticker],
          { modifier, expires: tick + lifetime },
        ],
      },
    }));
  };

  // Computed
  const { stocks, ranks } = stockState;

  // Render
  return (
    <Box spacing={4} p={4} w={"95vw"} minHeight={"95vh"}>
      <Flex justify={"space-between"} flexWrap={"wrap"}>
        {stocks.map(stock => (
          <StockRender
            name={stock.name}
            ticker={stock.ticker}
            change={stock.change}
            priceHistory={stock.priceHistory}
            pair={stock.pair}
            key={stock.name}
            rankHistory={ranks[stock.ticker]}
            onBuy={() =>
              pushModifier(
                stock.ticker,
                { multipliers: [BUY_PRICE_MODIFIER] },
                BUY_MODIFIER_TICK_LIFETIME
              )
            }
            onSell={() =>
              pushModifier(
                stock.ticker,
                { multipliers: [SELL_PRICE_MODIFIER] },
                SELL_MODIFIER_TICK_LIFETIME
              )
            }
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

const handleTick = (
  tick: number,
  stocks: Stock[],
  stockPriceMods: PriceModifierMap,
  stockRankMap: RoundRankMap
): StockState => {
  const updatedStockRankMap = { ...stockRankMap };
  const updatedStockPriceMods = updatePriceModifierMap(stockPriceMods, tick);

  if (roundTickPoints.includes(tick)) {
    console.log(`Round: ${tick}`);
    // Rank stocks
    const stockRanks = stocks.reduce<{ [key: string]: Pair }>((acc, stock) => {
      acc[stock.ticker] = stock.pair;
      return acc;
    }, {});

    const [flop] = deck.shuffle().drawFlop();
    const res = mapPairsToRank(stockRanks, flop);
    for (const ticker in res) {
      updatedStockRankMap[ticker] = [
        ...updatedStockRankMap[ticker],
        res[ticker],
      ];
      updatedStockPriceMods[ticker] = [
        ...updatedStockPriceMods[ticker],
        {
          expires: tick + ROUND_MODIFIER_TICK_LIFETIME,
          modifier: {
            multipliers: ROUND_RANK_MODIFIERS[res[ticker]],
            volatility: ROUND_FLUCTUATION_MAX,
          },
        },
      ];
    }
  }

  const updatedStocks = stocks.map(stock => {
    return tickPrice(
      stock,
      updatedStockPriceMods[stock.ticker].map(m => m.modifier)
    );
  });

  return {
    stocks: updatedStocks,
    priceMods: updatedStockPriceMods,
    ranks: updatedStockRankMap,
  };
};

export type Modifier = { multipliers?: number[]; volatility?: number };

type PriceModifier = { modifier: Modifier; expires: number };

type PriceModifierMap = {
  [key: string]: PriceModifier[];
};

type RoundRankMap = {
  [key: string]: RoundRank[];
};

const expireModifiers = (priceModifiers: PriceModifier[], tick: number) =>
  priceModifiers.filter(m => m.expires > tick);

const updatePriceModifierMap = (
  map: PriceModifierMap,
  tick: number
): PriceModifierMap => {
  return Object.entries(map).reduce((acc, [key, modifiers]) => {
    // @ts-ignore
    acc[key] = expireModifiers(modifiers, tick);
    return acc;
  }, {});
};

const roundTickPoints = range(0, NUM_ROUNDS).map((_, i) =>
  Math.ceil((i + 1) * TICKS_PER_WEEK - ROUND_MODIFIER_TICK_LIFETIME)
);
console.log(roundTickPoints);

export default Test;
