import { Heading, HStack, Radio, RadioGroup, VStack } from "@chakra-ui/react";
import React from "react";
import { isWeekend } from "../../core/helpers";
import { PeerAction } from "../../peer/PeerAction";
import { StoreSelector } from "../../store/StoreSelector";
import { setStore, useStore } from "../../store/store";
import BidsTable from "../render/tables/BidsTable";
import PlayerSummaryTable from "../render/tables/PlayerSummaryTable";
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
    <VStack spacing={6} align={"flex-start"} p={4} w={"45%"} bg={"white"}>
      <Heading fontSize={"lg"}>Players</Heading>
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

      <Heading fontSize={"lg"}>Player Summary</Heading>
      <PlayerSummaryTable
        cash={viewedPlayer.cash}
        assetsValue={portfolio.totalValue}
      />

      <Heading fontSize={"lg"}>Player Positions</Heading>
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
        <>
          <Heading fontSize={"lg"}>Your Bids</Heading>
          <BidsTable
            player={viewedPlayer}
            stocks={stocks}
            onCancelBid={bidId =>
              PeerAction.cancelBid(hostPeerId, secretKey, bidId)
            }
          />
        </>
      )}
    </VStack>
  );
}

export default SideBar;
