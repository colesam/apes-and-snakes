import { PeerAction } from "../PeerAction";
import { StoreAction } from "../../store/StoreAction";
import PeerConnectionManager from "../PeerConnectionManager";

// Host only
export const endGame = () => {
  PeerAction.endGame();
  StoreAction.resetStores();
  PeerConnectionManager.clearConnections();
};
