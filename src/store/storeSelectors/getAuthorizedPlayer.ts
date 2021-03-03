import { TStore } from "../store";

export const getAuthorizedPlayer = (secretKey: string) => (s: TStore) => {
  const playerId = s.secretKeyPlayerIdMap.get(secretKey);
  if (!playerId) return null;

  const player = s.players.find(player => player.id === playerId);
  return player || null;
};
