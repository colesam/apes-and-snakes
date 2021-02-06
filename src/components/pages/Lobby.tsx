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
import { resetSharedStore, useSharedStore } from "../../core/store/sharedStore";
import { Redirect } from "wouter";
import shallow from "zustand/shallow";
import {
  resetPrivateStore,
  usePrivateStore,
} from "../../core/store/privateStore";

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
    resetPrivateStore();
    resetSharedStore();
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
