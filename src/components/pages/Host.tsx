import { Alert, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Redirect } from "wouter";
import { namespace } from "../../config";
import { generateRoomCode } from "../../core/generateId";
import PeerConnectionManager from "../../peer/PeerConnectionManager";
import { StoreAction } from "../../store/StoreAction";
import { useSharedStore } from "../../store/sharedStore";

function Host() {
  // State
  const roomCode = useSharedStore(s => s.roomCode);

  // Side effects
  useEffect(() => {
    const newRoomCode = generateRoomCode();
    PeerConnectionManager.register(`${namespace} ${newRoomCode}`)
      .then(() => {
        StoreAction.hostGame(newRoomCode);
      })
      .catch(err => console.error(err));
  }, []);

  // Redirects
  if (roomCode) {
    return <Redirect to="/lobby" />;
  }

  // Render
  return (
    <Alert status="info" fontSize="xl">
      <Spinner color="blue.500" thickness="3px" mr={7} />{" "}
      <Text>Creating Room...</Text>
    </Alert>
  );
}

export default Host;
