import { getPrivate, setPrivate } from "./privateStore";
import { getShared, setShared } from "./sharedStore";
import { RPlayer } from "./types/Player";
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

  pushPlayerKey: (key: string, playerId: string) => {
    const { playerKeyMap } = getPrivate();

    if (playerKeyMap.has(key)) {
      throw new Error(`Cannot push key->playerId entry, key already exists.`);
    }

    if (playerKeyMap.includes(playerId)) {
      throw new Error(
        `Cannot push key->playerId entry, playerId ${playerId} already exists.`
      );
    }

    setPrivate({ playerKeyMap: playerKeyMap.set(key, playerId) });
  },
};

export default storeActions;
