import React, { useEffect } from "react";
import { generateRoomCode } from "../../core/generateId";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";
import { Alert, Spinner, Text } from "@chakra-ui/react";
import { useLocation } from "wouter";
import storeActions from "../../core/store/storeActions";

function Rehost() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const newRoomCode = generateRoomCode();
    PeerConnectionManager.register(`${namespace} ${newRoomCode}`)
      .then(() => {
        storeActions.hostGame(newRoomCode);
        setLocation("/lobby");
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <Alert status="info" fontSize="xl">
      <Spinner color="blue.500" thickness="3px" mr={7} />{" "}
      <Text>Rehosting...</Text>
    </Alert>
  );
}

export default Rehost;
