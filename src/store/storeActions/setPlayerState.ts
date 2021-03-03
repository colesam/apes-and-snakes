import { TPlayer } from "../../core/player/Player";
import { setStore } from "../store";

export const setPlayerState = (playerId: string, updates: Partial<TPlayer>) => {
  setStore(s => ({
    players: s.players.map(player =>
      player.id === playerId ? player.set(updates) : player
    ),
  }));
};
