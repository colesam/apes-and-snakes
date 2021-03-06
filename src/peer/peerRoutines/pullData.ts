import { setStore } from "../../store/store";
import { PeerAction } from "../PeerAction";

export const pullData = async (hostPeerId: string) => {
  const sharedState = await PeerAction.pullData(hostPeerId);
  setStore(sharedState);
};
