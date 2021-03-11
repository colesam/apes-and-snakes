import { GameStatus } from "../../core/game/GameStatus";
import { setStore } from "../../store/store";
import { PeerAction } from "../PeerAction";

export const startGame = () => {
  PeerAction.startGame();
  setStore(s => {
    s.gameStatus = GameStatus.IN_GAME;
  });
};
