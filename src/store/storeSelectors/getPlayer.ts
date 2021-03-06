import { TStore } from "../store";

export const getPlayer = (playerId: string) => (s: TStore) =>
  s.players.find(player => player.id === playerId);
