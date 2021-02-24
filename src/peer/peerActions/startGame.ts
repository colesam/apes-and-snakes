import PeerConnectionManager from "../PeerConnectionManager";
import { TPeerAction } from "../types/TPeerAction";

export const startGame = () =>
  PeerConnectionManager.broadcast({ action: TPeerAction.START_GAME });
