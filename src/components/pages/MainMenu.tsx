import { Button, Divider, Stack } from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink, useLocation } from "wouter";
import shallow from "zustand/shallow";
import { AUTO_REHOST, NAMESPACE } from "../../config";
import generateId from "../../core/generateId";
import PeerConnectionManager from "../../peer/PeerConnectionManager";
import { PeerRoutine } from "../../peer/PeerRoutine";
import { StoreAction } from "../../store/StoreAction";
import { setStore, useStore } from "../../store/store";
import FloatingContainer from "../render/FloatingContainer";

function MainMenu() {
  // State
  const [isHost, previousRoomCode, secretKey] = useStore(
    s => [s.isHost, s.previousRoomCode, s.secretKey],
    shallow
  );
  const [, setLocation] = useLocation();

  if (previousRoomCode && AUTO_REHOST) {
    const hostPeerId = `${NAMESPACE} ${previousRoomCode}`;
    if (isHost) {
      // Rehost
      PeerConnectionManager.register(hostPeerId).then(() => {
        setStore(StoreAction.hostGame(previousRoomCode, false));
        setLocation("/lobby");
      });
    } else {
      // Rejoin
      setTimeout(() => {
        const peerId = `${hostPeerId} ${generateId()}`;
        PeerConnectionManager.register(peerId).then(async () => {
          await PeerConnectionManager.connect(hostPeerId);
          await PeerRoutine.reconnect(hostPeerId, secretKey);
          setLocation("/lobby");
        });
      }, 1000);
    }
  }

  return (
    <FloatingContainer>
      <Stack spacing={4}>
        <Button colorScheme="green" href="/host" as={RouterLink}>
          Host Game
        </Button>
        {isHost && previousRoomCode && (
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
