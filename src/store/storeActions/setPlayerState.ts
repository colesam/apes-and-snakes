import { Player } from "../../core/player/Player";
import { TStore } from "../store";

export const setPlayerState = (playerId: string, updates: Partial<Player>) => (
  s: TStore
) => {
  const player = s.players.find(player => player.id === playerId);
  if (player) {
    player.merge(updates);
  }
};
