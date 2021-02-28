import React, { useState } from "react";
import { useLocation } from "wouter";
import shallow from "zustand/shallow";
import { NAMESPACE } from "../../config";
import generateId from "../../core/generateId";
import { errorLog } from "../../core/helpers";
import PeerConnectionManager from "../../peer/PeerConnectionManager";
import { PeerRoutine } from "../../peer/PeerRoutine";
import { StoreAction } from "../../store/StoreAction";
import { usePrivateStore } from "../../store/privateStore";
import ReconnectForm from "../forms/ReconnectForm";
import FloatingContainer from "../render/FloatingContainer";

function Reconnect() {
  // Hooks
  const [secretKey, previousRoomCode, hostPeerId] = usePrivateStore(
    s => [s.secretKey, s.previousRoomCode, s.hostPeerId],
    shallow
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [, setLocation] = useLocation();

  // Handlers
  const handleConnect = async (roomCode: string) => {
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

      StoreAction.setHostPeerId(hostPID);
    }

    try {
      await PeerRoutine.reconnect(hostPID, secretKey);
      setLocation("/lobby");
    } catch (e) {
      errorLog(e);
      setIsConnecting(false);
    }
  };

  // Render
  return (
    <FloatingContainer>
      <ReconnectForm
        initialRoomCode={previousRoomCode}
        isSubmitting={isConnecting}
        onSubmit={handleConnect}
      />
    </FloatingContainer>
  );
}

export default Reconnect;
