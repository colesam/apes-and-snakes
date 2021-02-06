import React from "react";
import { Button, Divider, Stack } from "@chakra-ui/react";
import { Link as RouterLink } from "wouter";
import { usePrivateStore } from "../../core/store/privateStore";

function MainMenu() {
  const hostPeerId = usePrivateStore(s => s.hostPeerId);

  return (
    <Stack spacing={4}>
      <Button colorScheme="green" href="/host" as={RouterLink}>
        Host Game
      </Button>
      <Divider />
      <Button colorScheme="blue" href="/join" as={RouterLink}>
        Join Game
      </Button>
      {hostPeerId && (
        <>
          <Divider />
          <Button colorScheme="orange" href="/reconnect" as={RouterLink}>
            Reconnect to Previous Host
          </Button>
        </>
      )}
    </Stack>
  );
}

export default MainMenu;
