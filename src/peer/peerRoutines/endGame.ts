import { StoreAction } from "../../store/StoreAction";
import { PeerAction } from "../PeerAction";
import PeerConnectionManager from "../PeerConnectionManager";

// Host only
export const endGame = () => {
  PeerAction.endGame();
  StoreAction.resetStores();
  PeerConnectionManager.clearConnections();
};
