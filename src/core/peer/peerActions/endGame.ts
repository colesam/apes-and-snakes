import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const endGame = () =>
  PeerConnectionManager.broadcast({ action: TPeerAction.END_GAME });
