import { StoreSelector } from "../StoreSelector";
import { TStore } from "../store";

export const viewedPlayer = (s: TStore) => {
  return (
    StoreSelector.getPlayer(s.viewedPlayerId)(s) ||
    StoreSelector.getPlayer(s.playerId)(s)
  );
};
