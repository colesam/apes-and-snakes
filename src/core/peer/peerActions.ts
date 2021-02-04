import PeerConnectionManager from "./PeerConnectionManager";

const { send, broadcast } = PeerConnectionManager;

export enum PeerAction {
  PING = "PING",
  PONG = "PONG",
  JOIN = "JOIN",
  PUSH_DATA = "PUSH_DATA",
  PULL_DATA = "PULL_DATA",
}

// NOTE: Peer actions send only, do not update store or state
const peerActions = {
  ping: (peerId: string) => send(peerId, { action: PeerAction.PING }),

  pong: (peerId: string) => send(peerId, { action: PeerAction.PONG }),

  join: (peerId: string, playerName: string) =>
    send(peerId, { action: PeerAction.JOIN, payload: { playerName } }),

  pushData: (peerId: string, data: any) =>
    send(peerId, { action: PeerAction.PUSH_DATA, payload: data }),

  pullData: (peerId: string) => send(peerId, { action: PeerAction.PULL_DATA }),

  broadcastData: (data: any) =>
    broadcast({ action: PeerAction.PUSH_DATA, payload: data }),
};

export default peerActions;
