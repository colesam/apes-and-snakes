import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  BUY_MODIFIER_TICK_LIFETIME,
  BUY_PRICE_MODIFIER,
  PRICE_TICKS_PER_DAY,
  ROUND_FLUCTUATION_MAX,
  ROUND_RANK_MODIFIERS,
  ROUND_MODIFIER_TICK_LIFETIME,
  SELL_MODIFIER_TICK_LIFETIME,
  SELL_PRICE_MODIFIER,
  TICK_SPEED,
  NUM_ROUNDS,
  TICKS_PER_ROUND,
} from "../../config";
import { Pair } from "../../core/card/Pair";
import { mapPairsToRank, RoundRank } from "../../core/poker";
import { Stock } from "../../core/stock/Stock";
import { tickPrice } from "../../core/stock/tickPrice";
import { stocks as stockData, deck } from "../../store/mockData/stocks";
import StockRender from "../render/Stock";

function Test() {
  const [tick, setTick] = useState(0);
  const [stocks, setStocks] = useState<Stock[]>(stockData);
  const [stockPriceMods, setStockPriceMods] = useState<PriceModifierMap>(
    stockData.reduce<PriceModifierMap>((acc, { ticker }) => {
      acc[ticker] = [];
      return acc;
    }, {})
  );
  const [stockRankMap, setStockRankMap] = useState<RoundRankMap>(
    stockData.reduce<RoundRankMap>((acc, { ticker }) => {
      acc[ticker] = [];
      return acc;
    }, {})
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (tick < PRICE_TICKS_PER_DAY) {
        const updatedStockPriceMods = updatePriceModifierMap(
          stockPriceMods,
          tick
        );

        if (roundTickPoints.includes(tick)) {
          // Rank stocks
          const stockRanks = stocks.reduce<{ [key: string]: Pair }>(
            (acc, stock) => {
              acc[stock.ticker] = stock.pair;
              return acc;
            },
            {}
          );

          const [flop] = deck.shuffle().drawFlop();
          const res = mapPairsToRank(stockRanks, flop);
          const updatedStockRankMap = { ...stockRankMap };
          for (const ticker in res) {
            updatedStockRankMap[ticker].push(res[ticker]);
            updatedStockPriceMods[ticker].push({
              expires: tick + ROUND_MODIFIER_TICK_LIFETIME,
              modifier: {
                multipliers: ROUND_RANK_MODIFIERS[res[ticker]],
                volatility: ROUND_FLUCTUATION_MAX,
              },
            });
          }
          setStockRankMap(updatedStockRankMap);
        }

        setStockPriceMods(updatedStockPriceMods);

        setStocks(
          stocks.map(stock => {
            return tickPrice(
              stock,
              updatedStockPriceMods[stock.ticker].map(m => m.modifier)
            );
          })
        );

        setTick(tick + 1);
      }
    }, TICK_SPEED);
    return () => clearInterval(id);
  });

  const pushModifier = (
    ticker: string,
    modifier: Modifier,
    lifetime: number
  ) => {
    setStockPriceMods({
      ...stockPriceMods,
      [ticker]: [
        ...stockPriceMods[ticker],
        { modifier, expires: tick + lifetime },
      ],
    });
  };

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
            rankHistory={stockRankMap[stock.ticker]}
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
        {(((TICK_SPEED / 1000) * PRICE_TICKS_PER_DAY) / 60).toFixed(2)}
      </Text>
    </Box>
  );
}

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

const roundTickPoints = [...Array(NUM_ROUNDS)].map((_, i) =>
  Math.ceil((i + 1) * TICKS_PER_ROUND - ROUND_MODIFIER_TICK_LIFETIME)
);
console.log(roundTickPoints);

export default Test;
