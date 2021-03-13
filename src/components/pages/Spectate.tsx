import { Box, Flex, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { TICK_SPEED, TICKS_PER_WEEK, SIM_WEEKS, NUM_WEEKS } from "../../config";
import { PeerConnectionManager } from "../../peer/PeerConnectionManager";
import { StoreAction } from "../../store/StoreAction";
import { getStore, setStore, useStore } from "../../store/store";
import { logDebug } from "../../util/log";
import CommandBar from "../smart/CommandBar";
import FlopDisplay from "../smart/FlopDisplay";
import StockBox from "../smart/StockBox";

function Spectate() {
  // Shared store
  const stocks = useStore(s => s.stocks);
  const viewFullHistory = useStore(s => s.viewFullHistory);

  // Effects
  useEffect(() => {
    console.log(PeerConnectionManager.peerId);
  }, []);
  useEffect(() => {
    const { tick } = getStore();
    let id: NodeJS.Timeout | null = null;
    if (tick === 0) {
      setStore(StoreAction.setupGame);
    }

    logDebug("Starting new game interval");
    id = setInterval(() => {
      const { tick } = getStore();
      if (
        (!SIM_WEEKS || tick >= SIM_WEEKS * TICKS_PER_WEEK) &&
        tick <= NUM_WEEKS * TICKS_PER_WEEK
      ) {
        setStore(StoreAction.runTicks(1));
      }
    }, TICK_SPEED);

    return () => {
      logDebug("Clearing interval");
      if (id) clearInterval(id);
    };
  }, []);

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
      <Flex justify={"space-between"}>
        <Box w={"60%"} p={4}>
          <Flex justify={"center"} mb={10}>
            <FlopDisplay spacing={8} />
          </Flex>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            {stocks.map(stock => (
              <StockBox
                stock={stock}
                viewFullHistory={viewFullHistory}
                key={stock.ticker}
              />
            ))}
          </Flex>
        </Box>
        <VStack spacing={8} align={"flex-start"} w={"40%"}>
          TODO
        </VStack>
      </Flex>
    </Flex>
  );
}

export default Spectate;
