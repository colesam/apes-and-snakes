import Peer, { DataConnection } from "peerjs";
import { PEER_DEV_SERVER, USE_PEER_DEV_SERVER } from "../config";
import MessageHandler from "./MessageHandler";
import PeerError from "./error/PeerError";
import TimeoutError, { TIMEOUT_ERROR } from "./error/TimeoutError";
import handleAction from "./handleAction";

export default class PeerConnectionManager {
  /**
   * This client's connection.
   */
  static conn?: Peer;

  /**
   * Map of peer connections. Key is peer id, connection object is value.
   */
  static peers: { [key: string]: DataConnection } = {};

  /**
   * List of functions that are called when new peer connection is received.
   * @private
   */
  private static _connectionHandlers: ((conn: DataConnection) => void)[] = [];

  private static _messageHandler = new MessageHandler();

  static get peerId() {
    return this.conn?.id;
  }

  static register(peerId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      PeerConnectionManager.conn = new Peer(peerId, {
        ...(USE_PEER_DEV_SERVER ? PEER_DEV_SERVER : {}),
        debug: 2,
      });

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

    if (!PeerConnectionManager.peers.hasOwnProperty(peerId)) {
      throw new Error(`Failed to establish connection to ${peerId}`);
    }
  }

  static async send(peerId: string, payload: any): Promise<any> {
    const peerConn = PeerConnectionManager.peers[peerId];

    if (!peerConn) {
      console.log(`[DEBUG] PeerConnectionManager.peers`);
      console.log(PeerConnectionManager.peers);
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

    for (const peerId in PeerConnectionManager.peers) {
      res.push(PeerConnectionManager.send(peerId, payload));
    }

    return Promise.allSettled(res);
  }

  static clearConnections() {
    PeerConnectionManager.peers = {};
  }

  static removeConnection(peerId: string) {
    if (this.peers[peerId]) {
      delete this.peers[peerId];
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
        reject(new TimeoutError(5000));
      }, 5000);

      peerConn.on("open", () => {
        clearTimeout(timeoutId);

        if (!PeerConnectionManager.peers.hasOwnProperty(peerId)) {
          console.log(`[DEBUG] Peer connection opened to: ${peerId}`);

          peerConn.on("data", data =>
            PeerConnectionManager._handleReceiveData(peerConn, data)
          );

          PeerConnectionManager.peers[peerId] = peerConn;

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
    PeerConnectionManager._connectionHandlers.push(fn);
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

    PeerConnectionManager.peers[conn.peer] = conn;

    conn.on("data", data =>
      PeerConnectionManager._handleReceiveData(conn, data)
    );

    PeerConnectionManager._connectionHandlers.forEach(fn => {
      fn(conn);
    });
  }
}
