import { TStore } from "../../store/store";
import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const broadcastShared = (data: Partial<TStore>) =>
  PeerConnectionManager.broadcast({
    action: TPeerAction.PUSH_DATA,
    payload: data,
  });
