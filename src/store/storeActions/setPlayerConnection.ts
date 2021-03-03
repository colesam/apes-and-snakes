import {
  PlayerConnection,
  TPlayerConnection,
} from "../../core/player/PlayerConnection";
import { getStore } from "../store";

export const setPlayerConnection = (
  playerId: string,
  updates: Partial<TPlayerConnection> = { playerId }
) => {
  const { playerConnectionMap, setPlayerConnectionMap } = getStore();

  const conn: PlayerConnection =
    playerConnectionMap.get(playerId) || new PlayerConnection();

  setPlayerConnectionMap(playerId, conn.set(updates));
};

// TODO: This action is almost so simple it can be removed
