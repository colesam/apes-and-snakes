import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const closePosition = (
  peerId: string,
  secretKey: string,
  positionId: string
) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.CLOSE_POSITION,
    payload: { secretKey, positionId },
  });
