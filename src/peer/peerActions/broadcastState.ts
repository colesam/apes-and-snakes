import { TStore } from "../../store/store";
import { PeerConnectionManager } from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const broadcastState = (data: Partial<TStore>) =>
  PeerConnectionManager.broadcast({
    action: TPeerAction.PUSH_DATA,
    payload: data,
  });
