import { PeerConnectionManager } from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const join = (peerId: string, secretKey: string, playerName: string) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.JOIN,
    payload: { secretKey, playerName },
  });
