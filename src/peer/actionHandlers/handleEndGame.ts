import { StoreAction } from "../../store/StoreAction";
import PeerConnectionManager from "../PeerConnectionManager";
import { PeerRoutine } from "../PeerRoutine";

const handleEndGame = () => {
  PeerRoutine.clearPing();
  StoreAction.resetStores();
  PeerConnectionManager.clearConnections();
};

export default handleEndGame;
