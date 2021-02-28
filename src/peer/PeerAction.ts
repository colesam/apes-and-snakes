import { broadcastShared } from "./peerActions/broadcastShared";
import { closePosition } from "./peerActions/closePosition";
import { endGame } from "./peerActions/endGame";
import { join } from "./peerActions/join";
import { openPosition } from "./peerActions/openPosition";
import { ping } from "./peerActions/ping";
import { pullShared } from "./peerActions/pullShared";
import { pushPrivate } from "./peerActions/pushPrivate";
import { pushShared } from "./peerActions/pushShared";
import { reconnect } from "./peerActions/reconnect";
import { startGame } from "./peerActions/startGame";

export const PeerAction = {
  broadcastShared,
  closePosition,
  startGame,
  endGame,
  join,
  openPosition,
  ping,
  pullShared,
  pushPrivate,
  pushShared,
  reconnect,
};
