import { TStore } from "../../store/store";
import { PeerConnectionManager } from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const pushData = (peerId: string, state: Partial<TStore>) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.PUSH_DATA,
    payload: state,
  });
