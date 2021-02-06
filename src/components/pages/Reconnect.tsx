import React, { useEffect } from "react";
import { Text } from "@chakra-ui/react";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { Redirect } from "wouter";
import peerActions from "../../core/peer/peerActions";
import { useSharedStore } from "../../core/store/sharedStore";
import { usePrivateStore } from "../../core/store/privateStore";
import generateId from "../../core/generateId";

function Reconnect() {
  const [secretKey, hostPeerId] = usePrivateStore(s => [
    s.secretKey,
    s.hostPeerId,
  ]);

  const roomCode = useSharedStore(s => s.roomCode);

  useEffect(() => {
    console.log(`[DEBUG] Reconnecting to ${hostPeerId}`);
    // Register self
    PeerConnectionManager.register(`${hostPeerId} ${generateId()}`)
      .then(() => {
        // Connect to room
        PeerConnectionManager.connect(hostPeerId)
          .then(() => {
            peerActions.ping(hostPeerId);
            peerActions.reconnect(hostPeerId, secretKey);
            peerActions.pullShared(hostPeerId);
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, [hostPeerId]);

  if (roomCode) {
    return <Redirect to="/lobby" />;
  }

  if (!secretKey || !hostPeerId) {
    return <Redirect to="/" />;
  }

  return <Text>Reconnecting...</Text>;
}

export default Reconnect;
