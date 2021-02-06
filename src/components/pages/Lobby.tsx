import React from "react";
import {
  Alert,
  Divider,
  Stack,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { useSharedStore } from "../../core/store/sharedStore";
import { Redirect } from "wouter";
import shallow from "zustand/shallow";

function Lobby() {
  const [roomCode, players] = useSharedStore(
    s => [s.roomCode, s.players],
    shallow
  );

  if (!roomCode) {
    return <Redirect to="/" />;
  }

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
    </Stack>
  );
}

export default Lobby;
