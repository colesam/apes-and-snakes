import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const pullShared = (peerId: string) =>
  PeerConnectionManager.send(peerId, { action: TPeerAction.PULL_SHARED });
