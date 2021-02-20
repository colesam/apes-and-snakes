import { PlayerData } from "../../core/player/Player";
import { getShared, setShared } from "../sharedStore";

export const setPlayerState = (
  playerId: string,
  updates: Partial<PlayerData>
) => {
  setShared({
    players: getShared().players.map(player =>
      player.id === playerId ? player.set(updates) : player
    ),
  });
};
