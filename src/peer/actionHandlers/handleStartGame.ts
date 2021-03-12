import { GameStatus } from "../../core/game/GameStatus";
import { setStore } from "../../store/store";

const handleStartGame = () => {
  setStore(s => {
    s.gameStatus = GameStatus.IN_GAME;
  });
};

export default handleStartGame;
