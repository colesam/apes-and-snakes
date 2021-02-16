import React, { useState } from "react";
import JoinForm from "../forms/JoinForm";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";
import { useLocation } from "wouter";
import { usePrivateStore } from "../../core/store/privateStore";
import generateId from "../../core/generateId";
import { StoreAction } from "../../core/store/StoreAction";
import { NAME_TAKEN_ERROR } from "../../core/error/NameTakenError";
import { errorLog } from "../../core/helpers";
import shallow from "zustand/shallow";
import { PeerRoutine } from "../../core/peer/PeerRoutine";

function Join() {
  // Hooks
  const [secretKey, hostPeerId] = usePrivateStore(
    s => [s.secretKey, s.hostPeerId],
    shallow
  );
  const [nameTakenError, setNameTakenError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [, setLocation] = useLocation();

  // Handlers
  const handleConnect = async (roomCode: string, name: string) => {
    setIsConnecting(true);
    const hostPID = hostPeerId || `${namespace} ${roomCode}`;

    // Register self
    if (!hostPeerId) {
      const peerId = `${hostPID} ${generateId()}`;

      try {
        await PeerConnectionManager.register(peerId);
        await PeerConnectionManager.connect(hostPID);
      } catch (e) {
        errorLog(e);
      }

      StoreAction.setHostPeerId(hostPID);
    }

    // Try to join as new player
    try {
      await PeerRoutine.join(hostPID, secretKey, name);
      setLocation("/lobby");
    } catch (e) {
      if (e.name === NAME_TAKEN_ERROR) {
        setNameTakenError(true);
      } else {
        errorLog(e);
      }
      setIsConnecting(false);
    }
  };

  // Render
  return (
    <JoinForm
      isSubmitting={isConnecting}
      nameTakenError={nameTakenError}
      onSubmit={handleConnect}
    />
  );
}

export default Join;
