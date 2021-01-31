import Peer from "peerjs";
import { Map, List } from "immutable";

export default class PeerConnectionManager {
  /**
   * This client's connection.
   */
  static conn?: Peer;

  /**
   * Map of peer connections. Key is peer id, connection object is value.
   */
  static peers = Map<string, Peer.DataConnection>();

  /**
   * List of functions that are called when data is received.
   * @private
   */
  private static _dataHandlers = List<(data: any) => void>();

  static register(peerId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      PeerConnectionManager.conn = new Peer(peerId);

      PeerConnectionManager.conn.on("connection", (conn) => {
        PeerConnectionManager.peers.set(conn.peer, conn);
        conn.on("data", PeerConnectionManager._handleReceiveData);
      });

      PeerConnectionManager.conn.on("open", resolve);
      PeerConnectionManager.conn.on("error", reject);
    });
  }

  static connect(peerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!PeerConnectionManager.conn) {
        reject("Cannot connect to peer without first calling register.");
        return;
      }

      const peerConn = PeerConnectionManager.conn.connect(peerId);
      PeerConnectionManager.peers.set(peerId, peerConn);

      peerConn.on("data", PeerConnectionManager._handleReceiveData);
      peerConn.on("open", resolve);
    });
  }

  static send(peerId: string, payload: string) {
    if (!PeerConnectionManager.peers.has(peerId)) {
      throw new Error(
        `Cannot send message to ${peerId}, no connection exists.`
      );
    }
    PeerConnectionManager.peers.get(peerId)!.send(payload);
  }

  // Event handlers
  static onReceiveData(fn: (data: any) => void) {
    PeerConnectionManager._dataHandlers.push(fn);
  }

  static onReceiveConnection(
    fn: (dataConnection: Peer.DataConnection) => void
  ) {
    if (!PeerConnectionManager.conn) {
      throw new Error(
        "Cannot handle incoming connections without first calling register."
      );
    }
    PeerConnectionManager.conn.on("connection", fn);
  }

  private static _handleReceiveData(data: any) {
    PeerConnectionManager._dataHandlers.forEach((fn) => {
      fn(data);
    });
  }
}
