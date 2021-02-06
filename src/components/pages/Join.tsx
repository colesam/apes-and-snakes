import React, { useState } from "react";
import JoinForm from "../forms/JoinForm";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";
import { Redirect } from "wouter";
import peerActions from "../../core/peer/peerActions";
import { useSharedStore } from "../../core/store/sharedStore";
import { usePrivateStore } from "../../core/store/privateStore";
import generateId from "../../core/generateId";
import storeActions from "../../core/store/storeActions";

function Join() {
  const secretKey = usePrivateStore(s => s.secretKey);
  const roomCode = useSharedStore(s => s.roomCode);
  const [isConnecting, setIsConnecting] = useState(false);

  if (roomCode) {
    return <Redirect to="/lobby" />;
  }

  const handleConnect = (roomCode: string, name: string) => {
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
            peerActions.join(hostPeerId, secretKey, name);
            peerActions.pullShared(hostPeerId);
          })
          .catch(err => console.error(err))
          .finally(() => setIsConnecting(false));
      })
      .catch(err => console.error(err));
  };

  return <JoinForm isSubmitting={isConnecting} onSubmit={handleConnect} />;
}

export default Join;
