import { PeerConnectionManager } from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const pullData = (peerId: string) =>
  PeerConnectionManager.send(peerId, { action: TPeerAction.PULL_DATA });
