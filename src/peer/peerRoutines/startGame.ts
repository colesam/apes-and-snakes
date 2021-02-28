import { GameStatus } from "../../core/game/GameStatus";
import { setShared } from "../../store/sharedStore";
import { PeerAction } from "../PeerAction";

export const startGame = () => {
  PeerAction.startGame();
  setShared({ gameStatus: GameStatus.IN_GAME });
};
