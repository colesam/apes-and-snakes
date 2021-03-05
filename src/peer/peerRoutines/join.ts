import { setStore } from "../../store/store";
import { PeerAction } from "../PeerAction";
import { PeerRoutine } from "../PeerRoutine";

export const join = async (
  hostPeerId: string,
  roomCode: string,
  secretKey: string,
  name: string
) => {
  const { playerId } = await PeerAction.join(hostPeerId, secretKey, name);
  setStore({ playerId, hostPeerId, previousRoomCode: roomCode });

  PeerRoutine.establishPing(hostPeerId);
  await PeerRoutine.pullData(hostPeerId);
};
