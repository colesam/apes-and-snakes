import React, { useState } from "react";
import { useLocation } from "wouter";
import shallow from "zustand/shallow";
import { NAMESPACE } from "../../config";
import generateId from "../../core/generateId";
import { errorLog } from "../../core/helpers";
import PeerConnectionManager from "../../peer/PeerConnectionManager";
import { PeerRoutine } from "../../peer/PeerRoutine";
import { NAME_TAKEN_ERROR } from "../../peer/error/NameTakenError";
import { setStore, useStore } from "../../store/store";
import JoinForm from "../forms/JoinForm";
import FloatingContainer from "../render/FloatingContainer";

function Join() {
  // Hooks
  const [secretKey, hostPeerId] = useStore(
    s => [s.secretKey, s.hostPeerId],
    shallow
  );
  const [nameTakenError, setNameTakenError] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [, setLocation] = useLocation();

  // Handlers
  const handleConnect = async (roomCode: string, name: string) => {
    setIsConnecting(true);
    const hostPID = hostPeerId || `${NAMESPACE} ${roomCode}`;

    // Register self
    if (!hostPeerId) {
      const peerId = `${hostPID} ${generateId()}`;

      try {
        await PeerConnectionManager.register(peerId);
        await PeerConnectionManager.connect(hostPID);
      } catch (e) {
        errorLog(e);
      }

      setStore(s => {
        s.hostPeerId = hostPID;
      });
    }

    // Try to join as new player
    try {
      await PeerRoutine.join(hostPID, roomCode, secretKey, name);
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
    <FloatingContainer>
      <JoinForm
        isSubmitting={isConnecting}
        nameTakenError={nameTakenError}
        onSubmit={handleConnect}
      />
    </FloatingContainer>
  );
}

export default Join;
