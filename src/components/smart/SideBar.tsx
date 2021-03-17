import { Box, HStack, Radio, RadioGroup, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { formatCurrency, isWeekend } from "../../core/helpers";
import { PeerAction } from "../../peer/PeerAction";
import { StoreSelector } from "../../store/StoreSelector";
import { setStore, useStore } from "../../store/store";
import BidsTable from "../render/tables/BidsTable";
import PositionsTable from "../render/tables/PositionsTable";

function SideBar() {
  // Store
  const tick = useStore(s => s.tick);
  const playerId = useStore(s => s.playerId);
  const players = useStore(s => s.players);
  const viewedPlayer = useStore(StoreSelector.viewedPlayer);
  const portfolio = useStore(StoreSelector.viewedPlayerPortfolio);
  const stocks = useStore(s => s.stocks);
  const hostPeerId = useStore(s => s.hostPeerId);
  const secretKey = useStore(s => s.secretKey);

  if (!viewedPlayer || !portfolio) return null;

  // Computed
  const isOwnPlayer = viewedPlayer.id === playerId;

  return (
    <VStack spacing={8} align={"flex-start"} p={4} w={"40%"} bg={"white"}>
      <Box>
        <Text fontWeight={"bold"}>View Player:</Text>
        <RadioGroup
          value={viewedPlayer.id}
          onChange={val => setStore({ viewedPlayerId: val.toString() })}
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
          {formatCurrency(viewedPlayer.cash)}
        </Text>

        <Text>
          <strong style={{ display: "block" }}>Player Asset Value:</strong>{" "}
          {formatCurrency(portfolio.totalValue)}
        </Text>

        <Text>
          <strong style={{ display: "block" }}>Player Total Value:</strong>{" "}
          {formatCurrency(viewedPlayer.cash + portfolio.totalValue)}
        </Text>
      </VStack>

      <PositionsTable
        tick={tick}
        player={viewedPlayer}
        isOwnPlayer={isOwnPlayer}
        stocks={stocks}
        isWeekend={isWeekend(tick)}
        onSell={bundleId =>
          PeerAction.closePosition(hostPeerId, secretKey, bundleId)
        }
      />

      {isOwnPlayer && (
        <BidsTable
          player={viewedPlayer}
          stocks={stocks}
          onCancelBid={bidId =>
            PeerAction.cancelBid(hostPeerId, secretKey, bidId)
          }
        />
      )}
    </VStack>
  );
}

export default SideBar;
