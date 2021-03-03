import { TStore } from "../store";

export const getAuthorizedPlayer = (s: TStore) => (secretKey: string) => {
  const playerId = s.secretKeyPlayerIdMap[secretKey];
  if (!playerId) return null;

  const player = s.players.find(player => player.id === playerId);
  return player || null;
};
