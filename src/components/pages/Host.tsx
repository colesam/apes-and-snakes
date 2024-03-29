import { Alert, Spinner, Text } from "@chakra-ui/react";
import LogRocket from "logrocket";
import React, { useEffect } from "react";
import { Redirect } from "wouter";
import { NAMESPACE } from "../../config";
import { generateRoomCode } from "../../core/generateId";
import { PeerConnectionManager } from "../../peer/PeerConnectionManager";
import { StoreAction } from "../../store/StoreAction";
import { setStore, useStore } from "../../store/store";
import FloatingContainer from "../render/FloatingContainer";

function Host() {
  // State
  const roomCode = useStore(s => s.roomCode);

  // Side effects
  useEffect(() => {
    const newRoomCode = generateRoomCode();
    PeerConnectionManager.register(`${NAMESPACE} ${newRoomCode}`)
      .then(() => {
        if (process.env.REACT_APP_LOG_ROCKET_ENABLED === "true") {
          LogRocket.identify("host", { name: "host" });
        }
        setStore(StoreAction.hostGame(newRoomCode));
      })
      .catch(err => console.error(err));
  }, []);

  // Redirects
  if (roomCode) {
    return <Redirect to="/lobby" />;
  }

  // Render
  return (
    <FloatingContainer>
      <Alert status="info" fontSize="xl">
        <Spinner color="blue.500" thickness="3px" mr={7} />{" "}
        <Text>Creating Room...</Text>
      </Alert>
    </FloatingContainer>
  );
}

export default Host;
