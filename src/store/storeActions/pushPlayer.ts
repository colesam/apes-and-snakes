import { Player } from "../../core/player/Player";
import { setStore } from "../store";

export const pushPlayer = (player: Player) => {
  setStore(s => ({ players: [...s.players, player] }));
};
