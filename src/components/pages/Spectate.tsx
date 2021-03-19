import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { TICK_SPEED, TICKS_PER_WEEK, SIM_WEEKS, NUM_WEEKS } from "../../config";
import { PeerConnectionManager } from "../../peer/PeerConnectionManager";
import { StoreAction } from "../../store/StoreAction";
import { getStore, setStore } from "../../store/store";
import { logDebug, logTime } from "../../util/log";
import CommandBar from "../smart/CommandBar";
import StockGrid from "../smart/StockGrid";

function Spectate() {
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
        logTime(
          "setStore(StoreAction.runTicks(1)",
          () => {
            setStore(StoreAction.runTicks(1));
          },
          150
        );
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
      color={"black"}
    >
      <CommandBar />
      <StockGrid />
    </Flex>
  );
}

export default Spectate;
