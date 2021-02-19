import { List, Map } from "immutable";
import Peer, { DataConnection } from "peerjs";
import PeerError from "./error/PeerError";
import TimeoutError, { TIMEOUT_ERROR } from "./error/TimeoutError";
import MessageHandler from "./MessageHandler";
import handleAction from "./handleAction";

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
   * List of functions that are called when new peer connection is received.
   * @private
   */
  private static _connectionHandlers = List<(conn: DataConnection) => void>();

  private static _messageHandler = new MessageHandler();

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
        if (e.name === TIMEOUT_ERROR && attempt <= 3) {
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

  static async send(peerId: string, payload: any): Promise<any> {
    const peerConn = PeerConnectionManager.peers.get(peerId);

    if (!peerConn) {
      throw new Error(
        `Cannot send message to ${peerId}, no connection exists.`
      );
    }

    const res = await PeerConnectionManager._messageHandler.send(
      peerConn,
      payload
    );

    if (!res.success) {
      const { name, message } = res.error;
      throw new PeerError(message, name);
    }

    return res.payload;
  }

  static broadcast(payload: any): Promise<PromiseSettledResult<any>[]> {
    const res = [];

    for (const peerId of PeerConnectionManager.peers.keys()) {
      res.push(PeerConnectionManager.send(peerId, payload));
    }

    return Promise.allSettled(res);
  }

  static clearConnections() {
    PeerConnectionManager.peers = Map();
  }

  private static _establishConnection(peerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!PeerConnectionManager.conn) {
        reject("Cannot connect to peer without first calling register.");
        return;
      }

      const peerConn = PeerConnectionManager.conn.connect(peerId);
      const timeoutId = setTimeout(() => {
        reject(new TimeoutError(5000));
      }, 5000);

      peerConn.on("open", () => {
        clearTimeout(timeoutId);

        if (!PeerConnectionManager.peers.has(peerId)) {
          console.log(`[DEBUG] Peer connection opened to: ${peerId}`);

          peerConn.on("data", data =>
            PeerConnectionManager._handleReceiveData(peerConn, data)
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
  static onReceiveConnection(
    fn: (dataConnection: Peer.DataConnection) => void
  ) {
    PeerConnectionManager._connectionHandlers = PeerConnectionManager._connectionHandlers.push(
      fn
    );
  }

  private static _handleReceiveData(conn: Peer.DataConnection, data: any) {
    const request = this._messageHandler.handleMessage(conn, data);
    if (request) {
      const { messageId, action, payload } = request;
      // Route to action
      const respond = (payload?: any) => {
        this._messageHandler.respond(
          conn,
          {
            action,
            success: true,
            error: null,
            payload,
          },
          messageId
        );
      };
      const error = (error: PeerError) => {
        this._messageHandler.respond(
          conn,
          {
            action,
            success: false,
            error: error.toJSON(), // json-immutable doesn't seem to handle this automatically
          },
          messageId
        );
      };
      handleAction(action, { peerId: conn.peer, payload, respond, error });
    }
  }

  private static _handleReceiveConnection(conn: DataConnection) {
    console.log(`[DEBUG] New connection from peer ${conn.peer}`);

    PeerConnectionManager.peers = PeerConnectionManager.peers.set(
      conn.peer,
      conn
    );

    conn.on("data", data =>
      PeerConnectionManager._handleReceiveData(conn, data)
    );

    PeerConnectionManager._connectionHandlers.forEach(fn => {
      fn(conn);
    });
  }
}
