import { resetStore } from "../../store/store";
import { PeerConnectionManager } from "../PeerConnectionManager";
import { PeerRoutine } from "../PeerRoutine";

const handleEndGame = () => {
  PeerRoutine.clearPing();
  resetStore();
  PeerConnectionManager.clearConnections();
};

export default handleEndGame;
