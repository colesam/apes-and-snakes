import React from "react";
import {
  Alert,
  Divider,
  Stack,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { useStore } from "../../core/store/Store";
import { Redirect } from "wouter";

function Lobby() {
  const [roomCode, players] = useStore((s) => [s.roomCode, s.players]);

  if (!roomCode) {
    return <Redirect to="/" />;
  }

  const playerElems = players.map((player) => (
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
