import React from "react";
import { Button, Divider, Stack } from "@chakra-ui/react";
import { Link as RouterLink } from "wouter";
import { usePrivateStore } from "../../core/store/privateStore";

function MainMenu() {
  const isHost = usePrivateStore(s => s.isHost);
  const hostPeerId = usePrivateStore(s => s.hostPeerId);

  return (
    <Stack spacing={4}>
      <Button colorScheme="green" href="/host" as={RouterLink}>
        Host Game
      </Button>
      {isHost && (
        <Button colorScheme="orange" href="/rehost">
          Rehost
        </Button>
      )}
      <Divider />
      <Button colorScheme="blue" href="/join" as={RouterLink}>
        Join Game
      </Button>
      {!isHost && hostPeerId && (
        <Button colorScheme="orange" href="/reconnect" as={RouterLink}>
          Reconnect to Previous Host
        </Button>
      )}
    </Stack>
  );
}

export default MainMenu;
