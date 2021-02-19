import { setShared } from "../../store/sharedStore";
import { PeerAction } from "../PeerAction";

export const pullShared = async (hostPeerId: string) => {
  const sharedState = await PeerAction.pullShared(hostPeerId);
  setShared(sharedState);
};
