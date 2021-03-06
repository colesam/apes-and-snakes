import { Box, Flex, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { TICK_SPEED, TICKS_PER_WEEK, SIM_WEEKS, NUM_WEEKS } from "../../config";
import { StoreAction } from "../../store/StoreAction";
import { getStore, setStore, useStore } from "../../store/store";
import FlopDisplay from "../render/FlopDisplay";
import StockBox from "../render/StockBox";
import CommandBar from "../smart/CommandBar";

function Spectate() {
  // Shared store
  const stocks = useStore(s => s.stocks);
  const flop = useStore(s => s.flop);
  const retiredCard = useStore(s => s.retiredCard);
  const viewFullHistory = useStore(s => s.viewFullHistory);

  // Effects
  useEffect(() => {
    const { tick } = getStore();
    let id: NodeJS.Timeout | null = null;
    if (tick === 0) {
      setStore(StoreAction.setupGame);
    }

    console.log("[DEBUG] Starting new game interval");
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
      console.log("[DEBUG] Clearing interval!");
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
            <FlopDisplay
              cards={flop.cards}
              retiredCard={retiredCard}
              spacing={8}
              cardScale={1.4}
            />
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
