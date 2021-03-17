import {
  Button,
  Center,
  Divider,
  Flex,
  FormLabel,
  HStack,
  Switch,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { TICKS_PER_WEEK, TICKS_PER_DAY } from "../../config";
import { StoreAction } from "../../store/StoreAction";
import { setStore, useStore } from "../../store/store";

const day = (num: number) => {
  switch (num) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 7:
      return "Sunday";
  }
};

function CommandBar() {
  const tick = useStore(s => s.tick);
  const isHost = useStore(s => s.isHost);
  const viewFullHistory = useStore(s => s.viewFullHistory);
  const sortStocks = useStore(s => s.sortStocks);

  const weekNum = Math.floor(tick / TICKS_PER_WEEK) + 1;

  const dayNum = Math.floor((tick % TICKS_PER_WEEK) / TICKS_PER_DAY) + 1;

  return (
    <HStack
      bg="gray.400"
      borderBottomWidth={1}
      borderColor="gray.600"
      px={4}
      py={2}
    >
      <Flex align={"center"}>
        <FormLabel htmlFor={"full-price-history"} fontSize={"md"} mb={0}>
          Full Price History
        </FormLabel>
        <Switch
          isChecked={viewFullHistory}
          onChange={() =>
            setStore(s => {
              s.viewFullHistory = !viewFullHistory;
            })
          }
          id={"full-price-history"}
        />
      </Flex>

      <Center height="20px">
        <Divider orientation="vertical" />
      </Center>

      <Flex align={"center"}>
        <FormLabel htmlFor={"sort-stocks"} fontSize={"md"} mb={0}>
          Sort Stocks By Portfolio %
        </FormLabel>
        <Switch
          isChecked={sortStocks}
          onChange={() =>
            setStore(s => {
              s.sortStocks = !sortStocks;
            })
          }
          id={"sort-stocks"}
        />
      </Flex>

      {isHost && (
        <>
          <Center height="20px">
            <Divider orientation="vertical" />
          </Center>
          <Button
            size="sm"
            colorScheme={"red"}
            onClick={() => setStore(StoreAction.setupGame)}
          >
            Reset Game
          </Button>
        </>
      )}
      <Center height="20px">
        <Divider orientation="vertical" />
      </Center>
      <Text>
        Week # {weekNum} ({day(dayNum)})
      </Text>
    </HStack>
  );
}

export default CommandBar;
