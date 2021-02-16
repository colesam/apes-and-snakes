import { TPeerAction } from "../types/TPeerAction";
import PeerConnectionManager from "../PeerConnectionManager";
import { PrivateState } from "../../store/privateStore";

export const pushPrivate = (peerId: string, state: Partial<PrivateState>) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.PUSH_PRIVATE,
    payload: state,
  });
