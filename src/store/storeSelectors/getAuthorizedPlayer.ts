import { StoreSelector } from "../StoreSelector";
import { TStore } from "../store";

export const getAuthorizedPlayer = (secretKey: string) => (s: TStore) => {
  const playerId = s.secretKeyPlayerIdMap.get(secretKey);
  if (!playerId) return null;

  return StoreSelector.getPlayer(playerId)(s);
};
