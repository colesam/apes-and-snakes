import {
  Text,
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
  RadioGroup,
  Radio,
  HStack,
} from "@chakra-ui/react";
import { last } from "lodash";
import React, { useState } from "react";
import {
  PURCHASE_QUANTITIES,
  TICKS_PER_WEEK,
  WEEKEND_END,
  WEEKEND_START,
} from "../../config";
import { PeerAction } from "../../peer/PeerAction";
import { useStore } from "../../store/store";
import FlopDisplay from "../render/FlopDisplay";
import PercentChange from "../render/PercentChange";
import StockRender from "../render/Stock";

function isWeekend(tick: number) {
  const relativeTick = tick % TICKS_PER_WEEK;
  return (
    relativeTick >= Math.floor(WEEKEND_START * TICKS_PER_WEEK) &&
    relativeTick <= Math.floor(WEEKEND_END * TICKS_PER_WEEK)
  );
}

function Play() {
  // Shared store
  const tick = useStore(s => s.tick);
  const players = useStore(s => s.players);
  const stocks = useStore(s => s.stocks);
  const flopDisplay = useStore(s => s.flopDisplay);

  // Private store
  const ping = useStore(s => s.ping);
  const hostPeerId = useStore(s => s.hostPeerId);
  const playerId = useStore(s => s.playerId);
  const secretKey = useStore(s => s.secretKey);

  // State
  const [viewPlayerId, setViewPlayerId] = useState(playerId);

  // Computed
  const player = players.find(player => player.id === viewPlayerId);

  if (!player) {
    throw new Error("No player found!");
  }

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
    <Flex
      justify={"space-between"}
      maxWidth={"100vw"}
      h={"100vh"}
      bg={"white"}
      color={"black"}
    >
      <Box p={4} w={"60%"}>
        <Flex justify={"center"} mb={10}>
          <FlopDisplay
            cards={flopDisplay ? flopDisplay.cards : []}
            spacing={8}
            cardScale={1.4}
          />
        </Flex>
        <Flex justify={"space-around"} flexWrap={"wrap"}>
          {stocks.map(stock => (
            <StockRender
              name={stock.name}
              ticker={stock.ticker}
              priceHistory={stock.priceHistory}
              rankHistory={stock.rankHistory}
              pair={stock.pair}
              pairIsNew={stock.pairIsNew}
              playerCash={player.cash}
              purchaseQuantities={PURCHASE_QUANTITIES}
              disableTransactions={isWeekend(tick) || viewPlayerId !== playerId}
              onBuy={(qty, price) => handleBuy(stock.ticker, qty, price)}
              key={stock.name}
            />
          ))}
        </Flex>
      </Box>

      <VStack spacing={8} align={"flex-start"} p={4} w={"40%"}>
        <Box>
          <Text fontWeight={"bold"}>View Player:</Text>
          <RadioGroup
            value={viewPlayerId}
            onChange={val => setViewPlayerId(val.toString())}
          >
            <HStack spacing={8}>
              {[...players]
                .sort(({ id }) => (id === playerId ? -1 : 1))
                .map(p => (
                  <Radio value={p.id} key={p.id}>
                    {p.name}
                  </Radio>
                ))}
            </HStack>
          </RadioGroup>
        </Box>

        <Text>
          <strong>Player Cash:</strong> {formatCurrency(player.cash)}
        </Text>

        <Table variant="simple" size={"sm"} bg={"white"}>
          <Thead>
            <Tr>
              <Th w={100}>Stock</Th>
              <Th w={100}>Qty</Th>
              <Th w={"20%"}>Orig Value</Th>
              <Th w={"20%"}>Curr Value</Th>
              <Th>% Change</Th>
              {viewPlayerId === playerId && <Th w={100}></Th>}
            </Tr>
          </Thead>
          <Tbody>
            {player.positions
              .filter(pos => !pos.isClosed)
              .map(pos => (
                <Tr key={pos.id} data-position-id={pos.id}>
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
                  {viewPlayerId === playerId && (
                    <Td>
                      <Button
                        size={"xs"}
                        colorScheme={"red"}
                        w={"100%"}
                        disabled={isWeekend(tick)}
                        onClick={() =>
                          PeerAction.closePosition(
                            hostPeerId,
                            secretKey,
                            pos.id
                          )
                        }
                      >
                        SELL
                      </Button>
                    </Td>
                  )}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </VStack>
      <Box
        position={"absolute"}
        right={"20px"}
        bottom={"20px"}
        bg={"white"}
        border={"1px"}
        p={1}
      >
        <strong style={{ marginRight: "5px" }}>Ping:</strong>
        <span>{ping ? `${ping}ms` : "none"}</span>
      </Box>
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
