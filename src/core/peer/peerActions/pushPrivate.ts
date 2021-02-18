import { PrivateState } from "../../store/privateStore";
import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const pushPrivate = (peerId: string, state: Partial<PrivateState>) =>
  PeerConnectionManager.send(peerId, {
    action: TPeerAction.PUSH_PRIVATE,
    payload: state,
  });
