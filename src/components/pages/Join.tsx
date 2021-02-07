import React, { useState } from "react";
import JoinForm from "../forms/JoinForm";
import PeerConnectionManager from "../../core/peer/PeerConnectionManager";
import { namespace } from "../../config";
import { Redirect, useLocation } from "wouter";
import peerActions from "../../core/peer/peerActions";
import { setShared, useSharedStore } from "../../core/store/sharedStore";
import { setPrivate, usePrivateStore } from "../../core/store/privateStore";
import generateId from "../../core/generateId";
import storeActions from "../../core/store/storeActions";
import NameTakenError, {
  NAME_TAKEN_ERROR,
} from "../../core/error/NameTakenError";
import { errorLog } from "../../core/helpers";
import shallow from "zustand/shallow";
import peerRoutines from "../../core/peer/peerRoutines";

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

    // Register self
    if (!hostPeerId) {
      const newHostPeerId = `${namespace} ${roomCode}`;
      const peerId = `${hostPeerId} ${generateId()}`;

      try {
        await PeerConnectionManager.register(peerId);
        await PeerConnectionManager.connect(newHostPeerId);
      } catch (e) {
        errorLog(e);
      }

      storeActions.setHostPeerId(newHostPeerId);
    }

    // Try to join as new player
    try {
      await peerRoutines.join(hostPeerId, secretKey, name);
      setLocation("/lobby");
    } catch (e) {
      if (e.name === NAME_TAKEN_ERROR) {
        setNameTakenError(true);
      } else {
        errorLog(e);
      }
    }

    setIsConnecting(false);
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
