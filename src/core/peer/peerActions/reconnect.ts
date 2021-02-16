import { TPeerAction } from "../types/TPeerAction";
import PeerConnectionManager from "../PeerConnectionManager";

export const reconnect = (peerId: string, secretKey: string) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.RECONNECT,
    payload: { secretKey },
  });
