import { Patch } from "immer";
import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const broadcastPatches = (data: Patch[]) =>
  PeerConnectionManager.broadcast({
    action: TPeerAction.PUSH_PATCH,
    payload: data,
  });
