import {
  Box,
  Button,
  Flex,
  Table,
  Tr,
  Thead,
  VStack,
  Tbody,
  Td,
  Th,
} from "@chakra-ui/react";
import { last } from "lodash";
import React from "react";
import { PURCHASE_QUANTITIES } from "../../config";
import { PeerAction } from "../../peer/PeerAction";
import { usePrivateStore } from "../../store/privateStore";
import { useSharedStore } from "../../store/sharedStore";
import PercentChange from "../render/PercentChange";
import StockRender from "../render/Stock";

function Play() {
  // Shared store
  const players = useSharedStore(s => s.players);
  const stocks = useSharedStore(s => s.stocks);

  // Private store
  const hostPeerId = usePrivateStore(s => s.hostPeerId);
  const playerId = usePrivateStore(s => s.playerId);
  const secretKey = usePrivateStore(s => s.secretKey);

  // Computed
  const player = players.find(player => player.id === playerId);

  const stockPriceMap = stocks.reduce<{ [key: string]: number }>(
    (acc, stock) => {
      acc[stock.ticker] = last(stock.priceHistory) || 0;
      return acc;
    },
    {}
  );

  // Handlers
  const handleBuy = (ticker: string, qty: number, price: number) => {
    PeerAction.openPosition(hostPeerId, secretKey, ticker, qty, price);
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
              purchaseQuantities={PURCHASE_QUANTITIES}
              onBuy={(qty, price) => handleBuy(stock.ticker, qty, price)}
              key={stock.name}
            />
          ))}
        </Flex>
      </Box>

      {player && (
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
      )}
    </Flex>
  );
}

function withCommas(x: number) {
  return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(x: number) {
  return "$" + withCommas(x);
}

export default Play;
