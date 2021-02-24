import { NUM_STOCKS } from "../config";
import { GameStatus } from "../core/game/GameStatus";
import { Player } from "../core/player/Player";
import { stocks } from "./mockData/stocks";

export const sharedState = {
  roomCode: "",
  gameStatus: GameStatus.LOBBY,
  players: [] as Player[],
  stocks: stocks.slice(0, NUM_STOCKS),
};
