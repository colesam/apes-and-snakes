import { getPrivate, setPrivate } from "./privateStore";
import { getShared, setShared } from "./sharedStore";
import { RPlayer } from "./types/Player";
import peerActions from "../peer/peerActions";
import { Map } from "immutable";

// Many actions use both store, so they all live in this file for now
// GOAL: Don't call peerActions from here, use middleware change listeners for that
const storeActions = {
  hostGame: (roomCode: string) => {
    setPrivate({ isHost: true, keyPlayerIdMap: Map() });
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

    if (isHost) peerActions.broadcastShared(newState);
  },

  pushPlayerKey: (key: string, playerId: string) => {
    const { keyPlayerIdMap } = getPrivate();

    if (keyPlayerIdMap.has(key)) {
      throw new Error(`Cannot push key->playerId entry, key already exists.`);
    }

    if (keyPlayerIdMap.includes(playerId)) {
      throw new Error(
        `Cannot push key->playerId entry, playerId ${playerId} already exists.`
      );
    }

    setPrivate({ keyPlayerIdMap: keyPlayerIdMap.set(key, playerId) });
  },
};

export default storeActions;
