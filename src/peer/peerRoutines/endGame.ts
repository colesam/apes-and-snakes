import { resetStore } from "../../store/store";
import { PeerAction } from "../PeerAction";
import PeerConnectionManager from "../PeerConnectionManager";

// Host only
export const endGame = () => {
  PeerAction.endGame();
  resetStore();
  PeerConnectionManager.clearConnections();
};
