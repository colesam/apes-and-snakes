import React from "react";
import {
  Alert,
  Divider,
  Stack,
  Text,
  List,
  ListItem,
  Button,
  Box,
} from "@chakra-ui/react";
import { useSharedStore } from "../../core/store/sharedStore";
import { Redirect } from "wouter";
import shallow from "zustand/shallow";
import { usePrivateStore } from "../../core/store/privateStore";
import PlayerConnectionStatus from "../render/PlayerConnectionStatus";
import { PeerRoutine } from "../../core/peer/PeerRoutine";

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
    if (isHost) {
      PeerRoutine.Host.endGame();
    }
  };

  // Computed
  const playerElems = players.map(player => (
    <ListItem
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      key={player.id}
    >
      <PlayerConnectionStatus
        connectionStatus={player.connectionStatus}
        mr={4}
      />
      <Text>{player.name}</Text>
    </ListItem>
  ));

  // Render
  return (
    <Stack spacing={4}>
      <Alert status="success" justifyContent="space-between" fontSize="xl">
        <Text>Room Code: </Text> <Text fontWeight="bold">{roomCode}</Text>
      </Alert>

      {players.size && <Divider />}

      {players.size && (
        <Box bg="gray.100" px={4} py={2}>
          <Text fontWeight="bold" mb={4}>
            Players:
          </Text>
          <List spacing={4}>{playerElems}</List>
        </Box>
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
