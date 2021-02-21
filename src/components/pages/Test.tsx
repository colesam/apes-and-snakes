import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  BUY_MODIFIER_TICK_LIFETIME,
  BUY_PRICE_MODIFIER,
  PRICE_TICKS_PER_DAY,
  SELL_MODIFIER_TICK_LIFETIME,
  SELL_PRICE_MODIFIER,
  TICK_SPEED,
} from "../../config";
import { Stock } from "../../core/stock/Stock";
import { tickPrice } from "../../core/stock/tickPrice";
import { stocks as stockData } from "../../store/mockData/stocks";
import StockRender from "../render/Stock";

function Test() {
  const [tick, setTick] = useState(0);
  const [stocks, setStocks] = useState<Stock[]>(stockData);
  const [stockPriceMods, setStockPriceMods] = useState<PriceModifierMap>(
    stockData.reduce((acc: PriceModifierMap, { ticker }) => {
      acc[ticker] = [];
      return acc;
    }, {})
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (tick < PRICE_TICKS_PER_DAY) {
        setTick(tick + 1);

        const updatedStockPriceMods = updatePriceModifierMap(
          stockPriceMods,
          tick
        );
        setStockPriceMods(updatedStockPriceMods);

        setStocks(
          stocks.map(stock => {
            return tickPrice(
              stock,
              updatedStockPriceMods[stock.ticker].map(m => m.modifier)
            );
          })
        );
      }
    }, TICK_SPEED);
    return () => clearInterval(id);
  });

  const pushModifier = (ticker: string, modifier: number, lifetime: number) => {
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
    <Box spacing={4} p={4} w={"95vw"} h={"95vh"}>
      <Flex justify={"space-between"} flexWrap={"wrap"}>
        {stocks.map(stock => (
          <StockRender
            name={stock.name}
            ticker={stock.ticker}
            change={stock.change}
            priceHistory={stock.priceHistory}
            pair={stock.pair}
            key={stock.name}
            onBuy={() =>
              pushModifier(
                stock.ticker,
                BUY_PRICE_MODIFIER,
                BUY_MODIFIER_TICK_LIFETIME
              )
            }
            onSell={() =>
              pushModifier(
                stock.ticker,
                SELL_PRICE_MODIFIER,
                SELL_MODIFIER_TICK_LIFETIME
              )
            }
          />
        ))}
      </Flex>
    </Box>
  );
}

type PriceModifier = { modifier: number; expires: number };

type PriceModifierMap = {
  [key: string]: PriceModifier[];
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

export default Test;
