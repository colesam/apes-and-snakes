import Peer, { DataConnection } from "peerjs";
import { Map, List } from "immutable";
// @ts-ignore
import { serialize } from "json-immutable/lib/serialize";
// @ts-ignore
import { deserialize } from "json-immutable/lib/deserialize";
import recordTypes from "../store/types/recordTypes";

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
  private static _dataHandlers = List<(peerId: string, data: any) => void>();

  /**
   * List of functions that are called when new peer connection is received.
   * @private
   */
  private static _connectionHandlers = List<(conn: DataConnection) => void>();

  static register(peerId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      PeerConnectionManager.conn = new Peer(peerId, { debug: 2 });

      PeerConnectionManager.conn.on(
        "connection",
        this._handleReceiveConnection
      );

      PeerConnectionManager.conn.on("open", resolve);
      PeerConnectionManager.conn.on("error", err => {
        console.error(err);
        reject();
      });
    });
  }

  static async connect(peerId: string) {
    let attempt = 1;

    // Chrome bug causes connections to never trigger correctly, attempt 3 times.
    while (true) {
      console.log(
        `[DEBUG] Establishing connection to ${peerId}. Attempt ${attempt}/3.`
      );

      try {
        await PeerConnectionManager._establishConnection(peerId);
        break;
      } catch (e) {
        if (e === "Timeout" && attempt <= 3) {
          attempt++;
        } else {
          throw e;
        }
      }
    }

    if (!PeerConnectionManager.peers.has(peerId)) {
      throw new Error(`Failed to establish connection to ${peerId}`);
    }
  }

  static send(peerId: string, payload: any) {
    if (!PeerConnectionManager.peers.has(peerId)) {
      throw new Error(
        `Cannot send message to ${peerId}, no connection exists.`
      );
    }
    console.log(`[DEBUG] Sending payload: `);
    console.log(serialize(payload));
    PeerConnectionManager.peers.get(peerId)!.send(serialize(payload));
  }

  static broadcast(payload: any) {
    for (const peerId of PeerConnectionManager.peers.keys()) {
      PeerConnectionManager.send(peerId, payload);
    }
  }

  private static _establishConnection(peerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!PeerConnectionManager.conn) {
        reject("Cannot connect to peer without first calling register.");
        return;
      }

      const peerConn = PeerConnectionManager.conn.connect(peerId);
      const timeoutId = setTimeout(() => {
        reject("Timeout");
      }, 5000);

      peerConn.on("open", () => {
        clearTimeout(timeoutId);

        if (!PeerConnectionManager.peers.has(peerId)) {
          console.log(`[DEBUG] Peer connection opened to: ${peerId}`);

          peerConn.on("data", data =>
            PeerConnectionManager._handleReceiveData(peerId, data)
          );

          PeerConnectionManager.peers = PeerConnectionManager.peers.set(
            peerId,
            peerConn
          );

          resolve();
        }
      });

      peerConn.on("error", err => {
        console.error(err);
        reject(err);
      });
    });
  }

  // Event handlers
  static onReceiveData(fn: (peerId: string, data: any) => void) {
    PeerConnectionManager._dataHandlers = PeerConnectionManager._dataHandlers.push(
      fn
    );
  }

  static onReceiveConnection(
    fn: (dataConnection: Peer.DataConnection) => void
  ) {
    PeerConnectionManager._connectionHandlers = PeerConnectionManager._connectionHandlers.push(
      fn
    );
  }

  private static _handleReceiveData(peerId: string, data: any) {
    console.log(`[DEBUG] Received data: ${data}`);
    console.log(`[DEBUG] From peer: ${peerId}`);

    PeerConnectionManager._dataHandlers.forEach(fn => {
      fn(peerId, deserialize(data, { recordTypes }));
    });
  }

  private static _handleReceiveConnection(conn: DataConnection) {
    console.log(`[DEBUG] New connection from peer ${conn.peer}`);

    PeerConnectionManager.peers = PeerConnectionManager.peers.set(
      conn.peer,
      conn
    );

    conn.on("data", data =>
      PeerConnectionManager._handleReceiveData(conn.peer, data)
    );

    PeerConnectionManager._connectionHandlers.forEach(fn => {
      fn(conn);
    });
  }
}
