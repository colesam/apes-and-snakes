import PeerConnectionManager from "./PeerConnectionManager";
import { SharedState } from "../store/sharedStore";
import { PrivateState } from "../store/privateStore";

const { send, broadcast } = PeerConnectionManager;

export enum PeerAction {
  PING = "PING",
  JOIN = "JOIN",
  RECONNECT = "RECONNECT",
  PUSH_SHARED = "PUSH_SHARED",
  PULL_SHARED = "PULL_SHARED",
  PUSH_PRIVATE = "PUSH_PRIVATE",
  END_GAME = "END_GAME",
}

// Rule: Actions may only call the send or broadcast methods
const peerActions = {
  ping: (peerId: string, secretKey: string, playerId: string) =>
    send(peerId, { action: PeerAction.PING, payload: { secretKey, playerId } }),

  join: (peerId: string, secretKey: string, playerName: string) =>
    send(peerId, {
      action: PeerAction.JOIN,
      payload: { secretKey, playerName },
    }),

  reconnect: (peerId: string, secretKey: string) =>
    send(peerId, {
      action: PeerAction.RECONNECT,
      payload: { secretKey },
    }),

  pushShared: (peerId: string, state: Partial<SharedState>) =>
    send(peerId, { action: PeerAction.PUSH_SHARED, payload: state }),

  broadcastShared: (data: Partial<SharedState>) =>
    broadcast({ action: PeerAction.PUSH_SHARED, payload: data }),

  pullShared: (peerId: string) =>
    send(peerId, { action: PeerAction.PULL_SHARED }),

  pushPrivate: (peerId: string, state: Partial<PrivateState>) =>
    send(peerId, { action: PeerAction.PUSH_PRIVATE, payload: state }),

  endGame: () => broadcast({ action: PeerAction.END_GAME }),
};

export default peerActions;
