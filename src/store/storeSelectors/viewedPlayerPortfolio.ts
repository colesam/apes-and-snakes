import { StoreSelector } from "../StoreSelector";
import { TStore } from "../store";

export const viewedPlayerPortfolio = (s: TStore) => {
  const viewedPlayer = StoreSelector.viewedPlayer(s);
  return viewedPlayer?.getPortfolio(s.stocks);
};
