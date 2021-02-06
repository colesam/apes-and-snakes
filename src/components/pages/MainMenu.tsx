import React from "react";
import { Button, Divider, Stack } from "@chakra-ui/react";
import { Link as RouterLink } from "wouter";
import { usePrivateStore } from "../../core/store/privateStore";
import { useSharedStore } from "../../core/store/sharedStore";
import shallow from "zustand/shallow";

function MainMenu() {
  // State
  const [isHost, hostPeerId] = usePrivateStore(
    s => [s.isHost, s.hostPeerId],
    shallow
  );
  const roomCode = useSharedStore(s => s.roomCode);

  return (
    <Stack spacing={4}>
      <Button colorScheme="green" href="/host" as={RouterLink}>
        Host Game
      </Button>
      {isHost && roomCode && (
        <Button colorScheme="orange" href="/rehost" as={RouterLink}>
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
