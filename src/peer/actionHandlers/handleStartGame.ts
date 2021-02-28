import { GameStatus } from "../../core/game/GameStatus";
import { setShared } from "../../store/sharedStore";

const handleStartGame = () => {
  setShared({ gameStatus: GameStatus.IN_GAME });
};

export default handleStartGame;
