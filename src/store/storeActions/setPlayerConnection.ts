import {
  PlayerConnection,
  TPlayerConnection,
} from "../../core/player/PlayerConnection";
import { getPrivate, setPrivate } from "../privateStore";

export const setPlayerConnection = (
  playerId: string,
  updates: Partial<TPlayerConnection> = { playerId }
) => {
  const { playerConnections } = getPrivate();

  const conn: PlayerConnection =
    playerConnections[playerId] || new PlayerConnection();

  setPrivate({
    playerConnections: {
      ...playerConnections,
      [playerId]: conn.set(updates),
    },
  });
};
