import { GameStatus } from "../../core/game/GameStatus";
import { setStore } from "../../store/store";

const handleStartGame = () => {
  setStore({ gameStatus: GameStatus.IN_GAME });
};

export default handleStartGame;
