import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import { Deck } from "../../core/card/Deck";
import Stock from "../render/Stock";

let deck = new Deck().shuffle();
let pairs;

[pairs, deck] = deck.dealPairs(2);

const stocks = [
  { name: "GameStop", ticker: "GME", change: 0.513, pair: pairs[0] },
  { name: "BestBuy", ticker: "BBY", change: -0.125, pair: pairs[1] },
];

function Test() {
  // Render
  return (
    <Box spacing={4} p={4} w={"95vw"} h={"95vh"}>
      <HStack>
        {stocks.map(stock => (
          <Stock
            name={stock.name}
            ticker={stock.ticker}
            change={stock.change}
            pair={stock.pair}
            key={stock.name}
          />
        ))}
      </HStack>
    </Box>
  );
}

export default Test;
