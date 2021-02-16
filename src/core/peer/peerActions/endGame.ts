import { TPeerAction } from "../types/TPeerAction";
import PeerConnectionManager from "../PeerConnectionManager";

export const endGame = () =>
  PeerConnectionManager.broadcast({ action: TPeerAction.END_GAME });
