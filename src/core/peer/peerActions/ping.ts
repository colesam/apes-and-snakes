import { TPeerAction } from "../types/TPeerAction";
import PeerConnectionManager from "../PeerConnectionManager";

export const ping = (peerId: string, secretKey: string, playerId: string) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.PING,
    payload: { secretKey, playerId },
  });
