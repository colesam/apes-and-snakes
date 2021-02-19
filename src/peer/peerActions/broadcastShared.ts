import { SharedState } from "../../store/sharedStore";
import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const broadcastShared = (data: Partial<SharedState>) =>
  PeerConnectionManager.broadcast({
    action: TPeerAction.PUSH_SHARED,
    payload: data,
  });
