import { broadcastPatches } from "./peerActions/broadcastPatches";
import { broadcastState } from "./peerActions/broadcastState";
import { closePosition } from "./peerActions/closePosition";
import { endGame } from "./peerActions/endGame";
import { join } from "./peerActions/join";
import { openPosition } from "./peerActions/openPosition";
import { ping } from "./peerActions/ping";
import { pullData } from "./peerActions/pullData";
import { pushData } from "./peerActions/pushData";
import { reconnect } from "./peerActions/reconnect";
import { startGame } from "./peerActions/startGame";

export const PeerAction = {
  broadcastPatches,
  broadcastState,
  closePosition,
  startGame,
  endGame,
  join,
  openPosition,
  ping,
  pullData,
  pushData,
  reconnect,
};
