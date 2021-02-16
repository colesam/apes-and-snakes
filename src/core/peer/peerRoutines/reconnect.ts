import { PeerAction } from "../PeerAction";
import { setPrivate } from "../../store/privateStore";
import { PeerRoutine } from "../PeerRoutine";

export const reconnect = async (hostPeerId: string, secretKey: string) => {
  const { playerId } = await PeerAction.reconnect(hostPeerId, secretKey);
  setPrivate({ playerId });

  PeerRoutine.establishPing(hostPeerId);
  await PeerRoutine.pullShared(hostPeerId);
};
