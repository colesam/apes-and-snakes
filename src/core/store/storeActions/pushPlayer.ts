import { RPlayer } from "../types/Player";
import { getShared, setShared } from "../sharedStore";

export const pushPlayer = (player: RPlayer) => {
  const { players } = getShared();
  setShared({ players: players.push(player) });
};
