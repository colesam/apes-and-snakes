import peerActions from "./peerActions";
import { getPrivate, setPrivate } from "../store/privateStore";
import { setShared } from "../store/sharedStore";
import { pingInterval } from "../../config";

// Peer routines are like actions, but can compose multiple together and update store
const peerRoutines = {
  join: async (hostPeerId: string, secretKey: string, name: string) => {
    const { playerId } = await peerActions.join(hostPeerId, secretKey, name);
    setPrivate({ playerId });

    peerRoutines.establishPing(hostPeerId);
    await peerRoutines.pullShared(hostPeerId);
  },

  reconnect: async (hostPeerId: string, secretKey: string) => {
    const { playerId } = await peerActions.reconnect(hostPeerId, secretKey);
    setPrivate({ playerId });

    peerRoutines.establishPing(hostPeerId);
    await peerRoutines.pullShared(hostPeerId);
  },

  pullShared: async (hostPeerId: string) => {
    const { sharedState } = await peerActions.pullShared(hostPeerId);
    setShared(sharedState);
  },

  establishPing(hostPeerId: string) {
    const { secretKey, playerId } = getPrivate();
    const pingIntervalId = setInterval(() => {
      peerActions.ping(hostPeerId, secretKey, playerId);
    }, pingInterval);
    setPrivate({ pingIntervalId });
  },

  removePing() {
    const { pingIntervalId } = getPrivate();
    if (pingIntervalId) {
      clearInterval(pingIntervalId);
      setPrivate({ pingIntervalId: null });
    }
  },
};

export default peerRoutines;
