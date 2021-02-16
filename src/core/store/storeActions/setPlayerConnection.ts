import { getPrivate, setPrivate } from "../privateStore";
import { PlayerConnection, TPlayerConnection } from "../types/PlayerConnection";

export const setPlayerConnection = (
  playerId: string,
  updates: Partial<TPlayerConnection> = { playerId }
) => {
  const { playerConnections } = getPrivate();
  const conn = playerConnections.get(playerId) || PlayerConnection();
  setPrivate({
    playerConnections: playerConnections.set(playerId, conn.merge(updates)),
  });
};
