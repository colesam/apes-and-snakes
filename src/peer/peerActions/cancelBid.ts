import { PeerConnectionManager } from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const cancelBid = (peerId: string, secretKey: string, bidId: string) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.CANCEL_BID,
    payload: { secretKey, bidId },
  });
