import React, { useState } from "react";
import JoinForm from "../forms/JoinForm";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";
import { Redirect } from "wouter";
import peerActions from "../../core/peer/peerActions";
import { useSharedStore } from "../../core/store/sharedStore";

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
            peerActions.ping(hostPeerId);
            peerActions.join(hostPeerId, name);
            peerActions.pullData(hostPeerId);
          })
          .catch(err => console.error(err))
          .finally(() => setIsConnecting(false));
      })
      .catch(err => console.error(err));
  };

  return <JoinForm isSubmitting={isConnecting} onSubmit={handleConnect} />;
}

export default Join;
