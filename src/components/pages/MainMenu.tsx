import { Button, Divider, Stack } from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink } from "wouter";
import shallow from "zustand/shallow";
import { useStore } from "../../store/store";
import FloatingContainer from "../render/FloatingContainer";

function MainMenu() {
  // State
  const [isHost, previousRoomCode, roomCode] = useStore(
    s => [s.isHost, s.previousRoomCode, s.roomCode],
    shallow
  );

  return (
    <FloatingContainer>
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
        {!isHost && previousRoomCode && (
          <Button colorScheme="orange" href="/reconnect" as={RouterLink}>
            Reconnect to Previous Host
          </Button>
        )}
      </Stack>
    </FloatingContainer>
  );
}

export default MainMenu;
