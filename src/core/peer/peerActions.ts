import PeerConnectionManager from "./PeerConnectionManager";

const { send, broadcast } = PeerConnectionManager;

export enum PeerAction {
  PING = "PING",
  PONG = "PONG",
  JOIN = "JOIN",
  PUSH_SHARED = "PUSH_SHARED",
  PULL_SHARED = "PULL_SHARED",
  PUSH_PRIVATE = "PUSH_PRIVATE",
}

// NOTE: Peer actions send only, do not update store or state
const peerActions = {
  ping: (peerId: string) => send(peerId, { action: PeerAction.PING }),

  pong: (peerId: string) => send(peerId, { action: PeerAction.PONG }),

  join: (peerId: string, personalKey: string, playerName: string) =>
    send(peerId, {
      action: PeerAction.JOIN,
      payload: { personalKey, playerName },
    }),

  pushShared: (peerId: string, mutation: any) =>
    send(peerId, { action: PeerAction.PUSH_SHARED, payload: mutation }),

  pullShared: (peerId: string) =>
    send(peerId, { action: PeerAction.PULL_SHARED }),

  pushPrivate: (peerId: string, mutation: any) =>
    send(peerId, { action: PeerAction.PUSH_PRIVATE, payload: mutation }),

  broadcastData: (data: any) =>
    broadcast({ action: PeerAction.PUSH_SHARED, payload: data }),
};

export default peerActions;
