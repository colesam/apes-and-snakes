import { getPrivate, resetPrivateStore, setPrivate } from "./privateStore";
import { getShared, resetSharedStore, setShared } from "./sharedStore";
import { RPlayer } from "./types/Player";
import { Map } from "immutable";

// Rule: actions may only call store methods, or other actions
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
    const { players } = getShared();
    setShared({ players: players.push(player) });
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

  updateLastPing: (playerId: string) => {
    setPrivate({
      playerIdLastPingMap: getPrivate().playerIdLastPingMap.set(
        playerId,
        new Date()
      ),
    });
  },

  authPlayerAction: (secretKey: string, playerId: string) => {
    const { secretKeyPlayerIdMap } = getPrivate();
    return (
      secretKeyPlayerIdMap.has(secretKey) &&
      secretKeyPlayerIdMap.get(secretKey) === playerId
    );
  },

  setHostPeerId: (hostPeerId: string) => setPrivate({ hostPeerId }),

  resetStores: () => {
    resetSharedStore();
    resetPrivateStore();
  },
};

export default storeActions;
