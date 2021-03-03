import { setStore } from "../../store/store";
import { PeerAction } from "../PeerAction";

export const pullShared = async (hostPeerId: string) => {
  const sharedState = await PeerAction.pullShared(hostPeerId);
  setStore(sharedState);
};
