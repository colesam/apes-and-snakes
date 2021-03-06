import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { TICK_SPEED, TICKS_PER_WEEK, SIM_WEEKS, NUM_WEEKS } from "../../config";
import { StoreAction } from "../../store/StoreAction";
import { getStore, setStore, useStore } from "../../store/store";
import FlopDisplay from "../render/FlopDisplay";
import StockBox from "../render/StockBox";

function Spectate() {
  // Shared store
  const stocks = useStore(s => s.stocks);
  const flop = useStore(s => s.flop);

  // Effects
  useEffect(() => {
    const { tick } = getStore();
    let id: NodeJS.Timeout | null = null;
    if (tick === 0) {
      setStore(StoreAction.setupGame);
    } else {
      console.log("[DEBUG] Starting new game interval");
      id = setInterval(() => {
        const { tick } = getStore();
        if (
          (!SIM_WEEKS || tick >= SIM_WEEKS * TICKS_PER_WEEK) &&
          tick < NUM_WEEKS * TICKS_PER_WEEK
        ) {
          setStore(StoreAction.runTicks(1));
        }
      }, TICK_SPEED);
    }
    return () => {
      console.log("[DEBUG] Clearing interval!");
      if (id) clearInterval(id);
    };
  }, []);

  // Render
  return (
    <Flex
      justify={"space-between"}
      w={"100vw"}
      h={"100vh"}
      bg={"white"}
      color={"black"}
    >
      <Box p={4} w={"60%"}>
        <Flex justify={"center"} mb={10}>
          <FlopDisplay cards={flop.cards} spacing={8} cardScale={1.4} />
        </Flex>
        <Flex justify={"space-around"} flexWrap={"wrap"}>
          {stocks.map(stock => (
            <StockBox stock={stock} key={stock.ticker} />
          ))}
        </Flex>
        <Text fontSize={"lg"} mb={8}>
          Time Per Week:{" "}
          {(((TICK_SPEED / 1000) * TICKS_PER_WEEK) / 60).toFixed(2)}
        </Text>
        {/*Restart game without booting all players, etc.*/}
        <Button
          colorScheme={"red"}
          onClick={() => setStore(StoreAction.setupGame)}
        >
          Reset
        </Button>
      </Box>
      <VStack spacing={8} align={"flex-start"} p={4} w={"40%"}>
        TODO
      </VStack>
    </Flex>
  );
}

export default Spectate;
