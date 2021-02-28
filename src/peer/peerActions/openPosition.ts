import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const openPosition = (
  peerId: string,
  secretKey: string,
  stockTicker: string,
  quantity: number,
  price: number
) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.OPEN_POSITION,
    payload: { secretKey, stockTicker, quantity, price },
  });
