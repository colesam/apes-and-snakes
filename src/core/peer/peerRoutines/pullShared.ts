import { PeerAction } from "../PeerAction";
import { setShared } from "../../store/sharedStore";

export const pullShared = async (hostPeerId: string) => {
  const sharedState = await PeerAction.pullShared(hostPeerId);
  setShared(sharedState);
};
