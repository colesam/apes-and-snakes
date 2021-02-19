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
import React from "react";
import { PeerAction } from "../../peer/PeerAction";
import { StoreAction } from "../../store/StoreAction";
import { players } from "../../store/mockData/players";
import PlayerConnectionStatus from "../render/PlayerConnectionStatus";

function Test() {
  // Mock data
  const isHost = true;
  const roomCode = "TEST";

  // Handlers
  const handleEndGame = () => {
    PeerAction.endGame();
    StoreAction.resetStores();
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

export default Test;
