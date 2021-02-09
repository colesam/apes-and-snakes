import { getPrivate, resetPrivateStore, setPrivate } from "./privateStore";
import { getShared, resetSharedStore, setShared } from "./sharedStore";
import { RPlayer } from "./types/Player";
import { Map } from "immutable";
import { PlayerConnection, TPlayerConnection } from "./types/PlayerConnection";

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

  setPlayerConnection: (
    playerId: string,
    updates: Partial<TPlayerConnection> = { playerId }
  ) => {
    const { playerConnections } = getPrivate();
    const conn = playerConnections.get(playerId) || PlayerConnection();
    setPrivate({
      playerConnections: playerConnections.set(playerId, conn.merge(updates)),
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
