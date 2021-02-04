import React, { useState } from "react";
import JoinForm from "../forms/JoinForm";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";
import { useSharedStore } from "../../core/store/Store";
import { Redirect } from "wouter";
import { join, ping } from "../../core/peer/PeerDataSync";

function Join() {
  const roomCode = useSharedStore(s => s.roomCode);
  const [isConnecting, setIsConnecting] = useState(false);

  if (roomCode) {
    return <Redirect to="/lobby" />;
  }

  const handleConnect = (roomCode: string, name: string) => {
    setIsConnecting(true);

    const hostPeerId = `${namespace} ${roomCode}`;

    // Register self
    PeerConnectionManager.register(`${hostPeerId} ${name}`)
      .then(() => {
        // Connect to room
        PeerConnectionManager.connect(hostPeerId)
          .then(() => {
            ping(hostPeerId);
            join(hostPeerId, name);
          })
          .catch(err => console.error(err))
          .finally(() => setIsConnecting(false));
      })
      .catch(err => console.error(err));
  };

  return <JoinForm isSubmitting={isConnecting} onSubmit={handleConnect} />;
}

export default Join;
