import {
  Box,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
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
    <VStack
      spacing={12}
      align={"stretch"}
      p={4}
      minWidth={600}
      bg={"white"}
      borderLeftWidth={1}
    >
      <Box>
        <Heading fontSize={"lg"} mb={4}>
          Players
        </Heading>
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

      <Box>
        <Heading fontSize={"lg"} mb={4}>
          Valuation
        </Heading>
        <PlayerSummaryTable
          cash={viewedPlayer.cash}
          assetsValue={portfolio.totalValue}
        />
      </Box>

      <Box>
        <Heading fontSize={"lg"} mb={4}>
          Positions
        </Heading>
        <PositionsTable
          tick={tick}
          player={viewedPlayer}
          isOwnPlayer={isOwnPlayer}
          stocks={stocks}
          isWeekend={isWeekend(tick)}
          onSell={bundleId =>
            PeerAction.closePosition(hostPeerId, secretKey, bundleId)
          }
          onTickerClick={ticker => setStore({ expandStockTicker: ticker })}
        />
      </Box>

      {isOwnPlayer && (
        <Box>
          <Heading fontSize={"lg"} mb={4}>
            Orders
          </Heading>
          <BidsTable
            player={viewedPlayer}
            stocks={stocks}
            onTickerClick={ticker => setStore({ expandStockTicker: ticker })}
            onCloseBid={bidId =>
              PeerAction.cancelBid(hostPeerId, secretKey, bidId)
            }
          />
        </Box>
      )}
    </VStack>
  );
}

export default SideBar;
