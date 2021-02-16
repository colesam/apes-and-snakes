import { broadcastShared } from "./peerActions/broadcastShared";
import { endGame } from "./peerActions/endGame";
import { join } from "./peerActions/join";
import { ping } from "./peerActions/ping";
import { pullShared } from "./peerActions/pullShared";
import { pushPrivate } from "./peerActions/pushPrivate";
import { pushShared } from "./peerActions/pushShared";
import { reconnect } from "./peerActions/reconnect";

export const PeerAction = {
  broadcastShared,
  endGame,
  join,
  ping,
  pullShared,
  pushPrivate,
  pushShared,
  reconnect,
};
