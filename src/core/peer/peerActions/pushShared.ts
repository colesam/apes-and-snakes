import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const pushShared = (peerId: string) =>
  PeerConnectionManager.send(peerId, { action: TPeerAction.PULL_SHARED });
