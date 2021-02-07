// Peer routines are like actions, but can compose multiple together and update store
import peerActions from "./peerActions";
import { setPrivate } from "../store/privateStore";
import { setShared } from "../store/sharedStore";

const peerRoutines = {
  join: async (hostPeerId: string, secretKey: string, name: string) => {
    const { playerId } = await peerActions.join(hostPeerId, secretKey, name);
    setPrivate({ playerId });

    const { sharedState } = await peerActions.pullShared(hostPeerId);
    setShared(sharedState);
  },
};

export default peerRoutines;
