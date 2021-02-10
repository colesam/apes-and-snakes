import React from "react";
import peerActions from "../../core/peer/peerActions";
import storeActions from "../../core/store/storeActions";
import {
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  Stack,
  Text,
  Box,
} from "@chakra-ui/react";
import PlayerConnectionStatus from "../render/PlayerConnectionStatus";
import { players } from "../../core/store/mockData/players";

function Test() {
  // Mock data
  const isHost = true;
  const roomCode = "TEST";

  // Handlers
  const handleEndGame = () => {
    peerActions.endGame();
    storeActions.resetStores();
  };

  // Computed
  const playerElems = players.map(player => (
    <ListItem
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      key={player.id}
    >
      <Text>{player.name}</Text>
      <PlayerConnectionStatus
        connectionStatus={player.connectionStatus}
        boxSize={6}
      />
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

export default Test;