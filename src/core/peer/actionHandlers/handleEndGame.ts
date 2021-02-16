import storeActions from "../../store/storeActions";
import PeerConnectionManager from "../PeerConnectionManager";
import peerRoutines from "../peerRoutines";

const handleEndGame = () => {
  peerRoutines.clearPing();
  storeActions.resetStores();
  PeerConnectionManager.clearConnections();
};

export default handleEndGame;
