import {
  Text,
  Box,
  Flex,
  VStack,
  RadioGroup,
  Radio,
  HStack,
} from "@chakra-ui/react";
import { sum } from "lodash";
import React, { useEffect, useState } from "react";
import { NAMESPACE, PURCHASE_QUANTITIES } from "../../config";
import generateId from "../../core/generateId";
import { formatCurrency, isWeekend } from "../../core/helpers";
import { PeerAction } from "../../peer/PeerAction";
import { PeerConnectionManager } from "../../peer/PeerConnectionManager";
import { PeerRoutine } from "../../peer/PeerRoutine";
import { StoreSelector } from "../../store/StoreSelector";
import { useStore } from "../../store/store";
import { logDebug } from "../../util/log";
import BidsTable from "../render/tables/BidsTable";
import PositionsTable from "../render/tables/PositionsTable";
import CommandBar from "../smart/CommandBar";
import FlopDisplay from "../smart/FlopDisplay";
import StockBox from "../smart/StockBox";

const attemptReconnectToHost = async (roomCode: string, secretKey: string) => {
  const hostId = `${NAMESPACE} ${roomCode}`;
  const peerId = `${hostId} ${generateId()}`;
  await PeerConnectionManager.register(peerId);
  await PeerConnectionManager.connect(hostId);
  await PeerRoutine.reconnect(hostId, secretKey);
};

function Play() {
  // Shared store
  const tick = useStore(s => s.tick);
  const players = useStore(s => s.players);
  const stocks = useStore(s => s.stocks);
  const gameStatus = useStore(s => s.gameStatus);
  const previousRoomCode = useStore(s => s.previousRoomCode);
  const viewFullHistory = useStore(s => s.viewFullHistory);
  const stockPriceMap = useStore(StoreSelector.stockPriceMap);

  // Private store
  const ping = useStore(s => s.ping);
  const hostPeerId = useStore(s => s.hostPeerId);
  const playerId = useStore(s => s.playerId);
  const secretKey = useStore(s => s.secretKey);

  // State
  const [viewPlayerId, setViewPlayerId] = useState(playerId);

  useEffect(() => {
    logDebug(`Play.tsx initial load.`);
  }, []);

  useEffect(() => {
    console.log(PeerConnectionManager.peerId);
  }, []);

  useEffect(() => {
    if (!PeerConnectionManager.peerId) {
      logDebug("Attempting to reconnect to host.");
      attemptReconnectToHost(previousRoomCode, secretKey);
    }
  }, [gameStatus]);

  // Computed
  const player = players.find(player => player.id === viewPlayerId);
  if (!player) {
    throw new Error("No player found!");
  }

  const playerAssetValue = sum(
    player.positionBundleList.flatMap(bundle =>
      bundle.openPositionList.map(pos =>
        pos.currentValue(stockPriceMap[bundle.stockTicker])
      )
    )
  );

  // Handlers
  const handleBuy = (ticker: string, qty: number, price: number) => {
    PeerAction.openPosition(hostPeerId, secretKey, ticker, qty, price);
  };

  // Render
  return (
    <Flex
      direction="column"
      align="stretch"
      w="98vw"
      minHeight="100vh"
      bg={"white"}
      color={"black"}
    >
      <CommandBar />
      <Flex justify="space-between">
        <Box p={4} w={"60%"}>
          <Flex justify={"center"} mb={10}>
            <FlopDisplay spacing={8} />
          </Flex>
          <Flex justify={"space-around"} flexWrap={"wrap"}>
            {stocks.map(stock => (
              <StockBox
                stock={stock}
                playerCash={player.cash}
                purchaseQuantities={PURCHASE_QUANTITIES}
                viewFullHistory={viewFullHistory}
                disableTransactions={
                  isWeekend(tick) || viewPlayerId !== playerId
                }
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

          <VStack mb={10} spacing={4} align="flex-start">
            <Text>
              <strong style={{ display: "block" }}>
                Player Cash (3% increase per week):
              </strong>{" "}
              {formatCurrency(player.cash)}
            </Text>

            <Text>
              <strong style={{ display: "block" }}>Player Asset Value:</strong>{" "}
              {formatCurrency(playerAssetValue)}
            </Text>

            <Text>
              <strong style={{ display: "block" }}>Player Total Value:</strong>{" "}
              {formatCurrency(player.cash + playerAssetValue)}
            </Text>
          </VStack>

          <PositionsTable
            tick={tick}
            player={player}
            isOwnPlayer={viewPlayerId === playerId}
            stockPriceMap={stockPriceMap}
            isWeekend={isWeekend(tick)}
            onSell={bundleId =>
              PeerAction.closePosition(hostPeerId, secretKey, bundleId)
            }
          />

          {viewPlayerId === playerId && (
            <BidsTable
              player={player}
              onCancelBid={bidId =>
                PeerAction.cancelBid(hostPeerId, secretKey, bidId)
              }
            />
          )}
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
    </Flex>
  );
}

export default Play;
