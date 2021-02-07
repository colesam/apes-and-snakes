import React, { useState } from "react";
import JoinForm from "../forms/JoinForm";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";
import { Redirect } from "wouter";
import peerActions from "../../core/peer/peerActions";
import { setShared, useSharedStore } from "../../core/store/sharedStore";
import { setPrivate, usePrivateStore } from "../../core/store/privateStore";
import generateId from "../../core/generateId";
import storeActions from "../../core/store/storeActions";

function Join() {
  // State
  const secretKey = usePrivateStore(s => s.secretKey);
  const roomCode = useSharedStore(s => s.roomCode);
  const [isConnecting, setIsConnecting] = useState(false);

  // Redirects
  if (roomCode) {
    return <Redirect to="/lobby" />;
  }

  // Handlers
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

            peerActions
              .join(hostPeerId, secretKey, name)
              .then(({ playerId }) => setPrivate({ playerId }))
              .catch(e => console.error(e));

            // This sets room code
            peerActions
              .pullShared(hostPeerId)
              .then(({ sharedState }) => setShared(sharedState));
          })
          .catch(err => console.error(err))
          .finally(() => setIsConnecting(false));
      })
      .catch(err => console.error(err));
  };

  // Render
  return <JoinForm isSubmitting={isConnecting} onSubmit={handleConnect} />;
}

export default Join;
