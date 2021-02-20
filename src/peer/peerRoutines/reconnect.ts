import { setPrivate } from "../../store/privateStore";
import { PeerAction } from "../PeerAction";
import { PeerRoutine } from "../PeerRoutine";

export const reconnect = async (hostPeerId: string, secretKey: string) => {
  const { playerId } = await PeerAction.reconnect(hostPeerId, secretKey);
  setPrivate({ playerId, hostPeerId });

  PeerRoutine.establishPing(hostPeerId);
  await PeerRoutine.pullShared(hostPeerId);
};
