import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const reconnect = (peerId: string, secretKey: string) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.RECONNECT,
    payload: { secretKey },
  });
