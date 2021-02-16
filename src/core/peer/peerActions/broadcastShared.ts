import { TPeerAction } from "../types/TPeerAction";
import PeerConnectionManager from "../PeerConnectionManager";
import { SharedState } from "../../store/sharedStore";

export const broadcastShared = (data: Partial<SharedState>) =>
  PeerConnectionManager.broadcast({
    action: TPeerAction.PUSH_SHARED,
    payload: data,
  });
