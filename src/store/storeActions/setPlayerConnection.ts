import {
  PlayerConnection,
  TPlayerConnection,
} from "../../core/player/PlayerConnection";
import { getStore, setStore } from "../store";

export const setPlayerConnection = (
  playerId: string,
  updates: Partial<TPlayerConnection> = { playerId }
) => {
  const { playerConnections } = getStore();

  const conn: PlayerConnection =
    playerConnections[playerId] || new PlayerConnection();

  setStore({
    playerConnections: {
      ...playerConnections,
      [playerId]: conn.set(updates),
    },
  });
};
