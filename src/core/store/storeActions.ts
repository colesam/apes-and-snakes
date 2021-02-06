import { getPrivate, resetPrivateStore, setPrivate } from "./privateStore";
import { getShared, resetSharedStore, setShared } from "./sharedStore";
import { RPlayer } from "./types/Player";
import peerActions from "../peer/peerActions";
import { Map } from "immutable";

// Many actions use both store, so they all live in this file for now
// GOAL: Don't call peerActions from here, use middleware change listeners for that
const storeActions = {
  hostGame: (roomCode: string, resetPlayerKeys = true) => {
    setPrivate({
      isHost: true,
      ...(resetPlayerKeys && { secretKeyPlayerIdMap: Map<string, string>() }),
    });
    storeActions.setRoomCode(roomCode);
  },

  setRoomCode: (roomCode: string) => {
    setShared({ roomCode });
    setPrivate({ previousRoomCode: roomCode });
  },

  pushPlayer: (player: RPlayer) => {
    const { isHost } = getPrivate();
    const { players } = getShared();

    const newState = {
      players: players.push(player),
    };

    setShared({ players: players.push(player) });

    if (isHost) peerActions.broadcastShared(newState);
  },

  mapSecretKeyPlayerId: (key: string, playerId: string) => {
    const { secretKeyPlayerIdMap } = getPrivate();

    setPrivate({
      secretKeyPlayerIdMap: secretKeyPlayerIdMap.set(key, playerId),
    });
  },

  mapPlayerIdPeerId: (playerId: string, peerId: string) => {
    const { playerIdPeerIdMap } = getPrivate();
    setPrivate({
      playerIdPeerIdMap: playerIdPeerIdMap.set(playerId, peerId),
    });
  },

  setHostPeerId: (hostPeerId: string) => setPrivate({ hostPeerId }),

  resetStores: () => {
    resetSharedStore();
    resetPrivateStore();
  },
};

export default storeActions;
