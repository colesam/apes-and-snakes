import { clearPing } from "./peerRoutines/clearPing";
import { endGame } from "./peerRoutines/endGame";
import { establishPing } from "./peerRoutines/establishPing";
import { join } from "./peerRoutines/join";
import { pullData } from "./peerRoutines/pullData";
import { reconnect } from "./peerRoutines/reconnect";
import { startGame } from "./peerRoutines/startGame";

export const PeerRoutine = {
  clearPing,
  establishPing,
  join,
  pullData,
  reconnect,

  // Host only routines
  Host: {
    startGame,
    endGame,
  },
};
