import { RPlayer } from "./types/Player";
import { getPrivate, setPrivate } from "./privateStore";
import { getShared, setShared } from "./sharedStore";
import peerActions from "../peer/peerActions";

// Many actions use both store, so they all live in this file for now
// GOAL: Don't call peerActions from here, use middleware change listeners for that
const storeActions = {
  hostGame: (roomCode: string) => {
    setPrivate({ isHost: true });
    setShared({ roomCode });
  },

  setRoomCode: (roomCode: string) => setShared({ roomCode }),

  pushPlayer: (player: RPlayer) => {
    const { isHost } = getPrivate();
    const { players } = getShared();

    const newState = {
      players: players.push(player),
    };

    setShared({ players: players.push(player) });

    if (isHost) peerActions.broadcastData(newState);
  },
};

export default storeActions;
