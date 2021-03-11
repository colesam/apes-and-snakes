import { setStore } from "../../store/store";
import { PeerAction } from "../PeerAction";
import { PeerRoutine } from "../PeerRoutine";

export const reconnect = async (hostPeerId: string, secretKey: string) => {
  const { playerId } = await PeerAction.reconnect(hostPeerId, secretKey);

  setStore(s => {
    s.playerId = playerId;
    s.hostPeerId = hostPeerId;
  });

  PeerRoutine.establishPing(hostPeerId);
  await PeerRoutine.pullData(hostPeerId);
};
