import {
  Alert,
  Divider,
  Stack,
  Text,
  List,
  ListItem,
  Button,
  Box,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { Redirect, useLocation } from "wouter";
import shallow from "zustand/shallow";
import { GameStatus } from "../../core/game/GameStatus";
import { PeerAction } from "../../peer/PeerAction";
import { PeerRoutine } from "../../peer/PeerRoutine";
import { usePrivateStore } from "../../store/privateStore";
import { useSharedStore } from "../../store/sharedStore";
import PlayerConnectionStatus from "../render/PlayerConnectionStatus";

function Lobby() {
  // State
  const isHost = usePrivateStore(s => s.isHost);
  const [gameStatus, roomCode, players] = useSharedStore(
    s => [s.gameStatus, s.roomCode, s.players],
    shallow
  );
  const [, setLocation] = useLocation();

  // Redirects
  if (!roomCode) {
    return <Redirect to={"/"} />;
  }

  // TODO: improve
  if (!isHost && gameStatus === GameStatus.IN_GAME) {
    return <Redirect to={"/play"} />;
  }

  // Handlers
  const handleStartGame = () => {
    if (isHost) {
      PeerAction.startGame();
      setLocation("/spectate");
    }
  };

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

      {players.length && <Divider />}

      {players.length && (
        <Box bg="gray.100" px={4} py={2}>
          <Text fontWeight="bold" mb={4}>
            Players:
          </Text>
          <List spacing={4}>{playerElems}</List>
        </Box>
      )}

      {isHost && (
        <HStack>
          <Button
            colorScheme="green"
            w="100%"
            onClick={handleStartGame}
            disabled={players.length < 1}
          >
            Start Game
          </Button>
          <Button colorScheme="red" w="100%" onClick={handleEndGame}>
            End Game
          </Button>
        </HStack>
      )}
    </Stack>
  );
}

export default Lobby;
