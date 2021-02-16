import { TPeerAction } from "../types/TPeerAction";
import PeerConnectionManager from "../PeerConnectionManager";

export const pullShared = (peerId: string) =>
  PeerConnectionManager.send(peerId, { action: TPeerAction.PULL_SHARED });
