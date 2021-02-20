import { Player } from "../../core/player/Player";
import { getShared, setShared } from "../sharedStore";

export const pushPlayer = (player: Player) => {
  const { players } = getShared();
  setShared({ players: [...players, player] });
};
