import { TPeerAction } from "../types/TPeerAction";
import PeerConnectionManager from "../PeerConnectionManager";

export const join = (peerId: string, secretKey: string, playerName: string) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.JOIN,
    payload: { secretKey, playerName },
  });
