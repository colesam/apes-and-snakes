import React from "react";
import {
  Alert,
  Divider,
  Stack,
  Text,
  UnorderedList,
  ListItem,
  Button,
} from "@chakra-ui/react";
import { useSharedStore } from "../../core/store/sharedStore";
import { Redirect } from "wouter";
import shallow from "zustand/shallow";
import { usePrivateStore } from "../../core/store/privateStore";
import peerActions from "../../core/peer/peerActions";
import storeActions from "../../core/store/storeActions";

function Lobby() {
  // State
  const isHost = usePrivateStore(s => s.isHost);
  const [roomCode, players] = useSharedStore(
    s => [s.roomCode, s.players],
    shallow
  );

  // Redirects
  if (!roomCode) {
    return <Redirect to="/" />;
  }

  // Handlers
  const handleEndGame = () => {
    peerActions.endGame();
    storeActions.resetStores();
  };

  // Computed
  const playerElems = players.map(player => (
    <ListItem key={player.id}>{player.name}</ListItem>
  ));

  return (
    <Stack spacing={4}>
      <Alert status="success" justifyContent="space-between" fontSize="xl">
        <Text>Room Code: </Text> <Text fontWeight="bold">{roomCode}</Text>
      </Alert>

      {players.size && <Divider />}

      {players.size && (
        <div>
          <Text fontWeight="bold">Players:</Text>
          <UnorderedList pl={5}>{playerElems}</UnorderedList>
        </div>
      )}

      {isHost && (
        <Button colorScheme="red" onClick={handleEndGame}>
          End Game
        </Button>
      )}
    </Stack>
  );
}

export default Lobby;
