import { Button, Center, Divider, HStack } from "@chakra-ui/react";
import React from "react";
import { StoreAction } from "../../store/StoreAction";
import { setStore, useStore } from "../../store/store";

function CommandBar() {
  const isHost = useStore(s => s.isHost);
  const viewFullHistory = useStore(s => s.viewFullHistory);

  return (
    <HStack
      bg="gray.400"
      borderBottomWidth={1}
      borderColor="gray.600"
      px={4}
      py={2}
    >
      <Button
        size="sm"
        onClick={() => setStore({ viewFullHistory: !viewFullHistory })}
      >
        {viewFullHistory ? "Viewing Full History" : "Viewing This Week"}
      </Button>
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
    </HStack>
  );
}

export default CommandBar;
