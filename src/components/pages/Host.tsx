import React, { useEffect } from "react";
import { generateRoomCode } from "../../core/generateId";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";
import { Alert, Spinner, Text } from "@chakra-ui/react";
import { Redirect } from "wouter";
import { useSharedStore } from "../../core/store/sharedStore";
import { StoreAction } from "../../core/store/StoreAction";

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
