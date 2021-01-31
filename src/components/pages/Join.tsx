import React, { useState } from "react";
import JoinForm from "../forms/JoinForm";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";

function Join() {
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = (roomCode: string, name: string) => {
    setIsConnecting(true);

    // Register self
    PeerConnectionManager.register(`${namespace} ${roomCode} ${name}`)
      .then(() => {
        // Connect to room
        PeerConnectionManager.connect(`${namespace} ${roomCode}`)
          .then(() => setConnected(true))
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err))
      .finally(() => setIsConnecting(false));
  };

  return <JoinForm isSubmitting={isConnecting} onSubmit={handleConnect} />;
}

export default Join;
