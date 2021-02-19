import React, { useState } from "react";
import PeerConnectionManager from "../../peer/PeerConnectionManager";
import { Redirect } from "wouter";
import { PeerAction } from "../../peer/PeerAction";
import { setShared, useSharedStore } from "../../store/sharedStore";
import { usePrivateStore } from "../../store/privateStore";
import generateId from "../../core/generateId";
import ReconnectForm from "../forms/ReconnectForm";
import { namespace } from "../../config";
import { StoreAction } from "../../store/StoreAction";
import shallow from "zustand/shallow";
import { errorLog } from "../../core/helpers";

function Reconnect() {
  // State
  const [secretKey, previousRoomCode] = usePrivateStore(
    s => [s.secretKey, s.previousRoomCode],
    shallow
  );
  const roomCode = useSharedStore(s => s.roomCode);
  const [isConnecting, setIsConnecting] = useState(false);

  // Redirects
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
            StoreAction.setHostPeerId(hostPeerId);

            PeerAction.reconnect(hostPeerId, secretKey).catch(errorLog);

            // This sets the room code
            PeerAction.pullShared(hostPeerId)
              .then(sharedState => setShared(sharedState))
              .catch(errorLog);
          })
          .catch(err => console.error(err))
          .finally(() => setIsConnecting(false));
      })
      .catch(err => console.error(err));
  };

  // Render
  return (
    <ReconnectForm
      initialRoomCode={previousRoomCode}
      isSubmitting={isConnecting}
      onSubmit={handleConnect}
    />
  );
}

export default Reconnect;
