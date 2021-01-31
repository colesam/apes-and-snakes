import React, { useEffect, useState } from "react";
import generateRoomCode from "../../core/generateRoomCode";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";
import { Alert, Spinner, Text } from "@chakra-ui/react";

function Host() {
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    if (!roomCode) {
      const newRoomCode = generateRoomCode();
      PeerConnectionManager.register(`${namespace} ${newRoomCode}`)
        .then(() => setRoomCode(newRoomCode))
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
