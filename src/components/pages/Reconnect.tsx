import React, { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { Redirect } from "wouter";
import peerActions from "../../core/peer/peerActions";
import { useSharedStore } from "../../core/store/sharedStore";
import { usePrivateStore } from "../../core/store/privateStore";
import generateId from "../../core/generateId";
import ReconnectForm from "../forms/ReconnectForm";
import { namespace } from "../../config";
import storeActions from "../../core/store/storeActions";

function Reconnect() {
  // State
  const secretKey = usePrivateStore(s => s.secretKey);
  const roomCode = useSharedStore(s => s.roomCode);
  const [isConnecting, setIsConnecting] = useState(false);

  if (roomCode) {
    return <Redirect to="/lobby" />;
  }

  // Handlers
  const handleConnect = (roomCode: string) => {
    setIsConnecting(true);

    const hostPeerId = `${namespace} ${roomCode}`;
    const peerId = `${hostPeerId} ${generateId()}`;

    // Register self
    PeerConnectionManager.register(peerId)
      .then(() => {
        // Connect to room
        PeerConnectionManager.connect(hostPeerId)
          .then(() => {
            storeActions.setHostPeerId(hostPeerId);
            peerActions.ping(hostPeerId);
            peerActions.reconnect(hostPeerId, secretKey);
            peerActions.pullShared(hostPeerId);
          })
          .catch(err => console.error(err))
          .finally(() => setIsConnecting(false));
      })
      .catch(err => console.error(err));
  };

  return (
    <ReconnectForm
      initialRoomCode={roomCode}
      isSubmitting={isConnecting}
      onSubmit={handleConnect}
    />
  );
}

export default Reconnect;
