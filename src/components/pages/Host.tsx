import React, { useEffect } from "react";
import generateRoomCode from "../../core/generateRoomCode";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";
import { Alert, Spinner, Text } from "@chakra-ui/react";
import { useStore } from "../../core/store/Store";
import { useLocation } from "wouter";

function Host() {
  const [roomCode, host] = useStore((s) => [s.roomCode, s.host]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!roomCode) {
      const newRoomCode = generateRoomCode();
      PeerConnectionManager.register(`${namespace} ${newRoomCode}`)
        .then(() => {
          // Weird bug: connections to host don't resolve if they happen too quickly?
          host(newRoomCode);
          setLocation("/lobby");
        })
        .catch((err) => console.error(err));
    }
  });

  return roomCode ? (
    <Alert status="success" justifyContent="space-between" fontSize="xl">
      <Text>Room Code: </Text> <Text fontWeight="bold">{roomCode}</Text>
    </Alert>
  ) : (
    <Alert status="info" fontSize="xl">
      <Spinner color="blue.500" thickness="3px" mr={7} />{" "}
      <Text>Creating Room...</Text>
    </Alert>
  );
}

export default Host;
