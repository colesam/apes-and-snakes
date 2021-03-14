import { PeerConnectionManager } from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const ping = (peerId: string, secretKey: string, playerId: string) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.PING,
    payload: { secretKey, playerId },
  });
