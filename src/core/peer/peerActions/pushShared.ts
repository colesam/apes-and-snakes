import { TPeerAction } from "../types/TPeerAction";
import PeerConnectionManager from "../PeerConnectionManager";

export const pushShared = (peerId: string) =>
  PeerConnectionManager.send(peerId, { action: TPeerAction.PULL_SHARED });
