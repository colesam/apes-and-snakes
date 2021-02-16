import { PeerAction } from "../PeerAction";
import { setPrivate } from "../../store/privateStore";
import { PeerRoutine } from "../PeerRoutine";

export const join = async (
  hostPeerId: string,
  secretKey: string,
  name: string
) => {
  const { playerId } = await PeerAction.join(hostPeerId, secretKey, name);
  setPrivate({ playerId });

  PeerRoutine.establishPing(hostPeerId);
  await PeerRoutine.pullShared(hostPeerId);
};
