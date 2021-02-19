import { getShared, setShared } from "../sharedStore";
import { RPlayer } from "../types/Player";

export const pushPlayer = (player: RPlayer) => {
  const { players } = getShared();
  setShared({ players: players.push(player) });
};
