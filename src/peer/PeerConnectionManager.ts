import Peer, { DataConnection } from "peerjs";
import { PEER_DEV_SERVER, USE_PEER_DEV_SERVER } from "../config";
import { logDebug, logError } from "../util/log";
import { MessageHandler } from "./MessageHandler";
import PeerError from "./error/PeerError";
import TimeoutError, { TIMEOUT_ERROR } from "./error/TimeoutError";
import handleAction from "./handleAction";

export interface TPeerConnectionManager {
  conn?: Peer;
  peers: { [key: string]: DataConnection };
  _connectionHandlers: ((conn: DataConnection) => void)[];
  _messageHandler: MessageHandler;
  peerId?: string;
  register: (peerId?: string) => Promise<string>;
  connect: (peerId: string) => Promise<void>;
  send: (peerId: string, payload: any) => Promise<any>;
  broadcast: (payload: any) => Promise<PromiseSettledResult<any>[]>;
  clearConnections: () => void;
  removeConnection: (peerId: string) => void;
  _establishConnection: (peerId: string) => Promise<void>;
  onReceiveConnection: (
    fn: (dataConnection: Peer.DataConnection) => void
  ) => void;
  _handleReceiveData: (conn: Peer.DataConnection, data: any) => void;
  _handleReceiveConnection: (conn: DataConnection) => void;
}

const __PeerConnectionManager__: TPeerConnectionManager = {
  /**
   * This client's connection.
   */
  conn: undefined,

  /**
   * Map of peer connections. Key is peer id, connection object is value.
   */
  peers: {},

  /**
   * List of functions that are called when new peer connection is received.
   * @private
   */
  _connectionHandlers: [],

  _messageHandler: new MessageHandler(),

  get peerId() {
    return __PeerConnectionManager__.conn?.id;
  },

  register(peerId) {
    return new Promise((resolve, reject) => {
      __PeerConnectionManager__.conn = new Peer(peerId, {
        ...(USE_PEER_DEV_SERVER ? PEER_DEV_SERVER : {}),
        debug: 2,
      });

      __PeerConnectionManager__.conn.on(
        "connection",
        __PeerConnectionManager__._handleReceiveConnection
      );

      __PeerConnectionManager__.conn.on("open", resolve);
      __PeerConnectionManager__.conn.on("error", err => {
        console.error(err);
        reject();
      });
    });
  },

  async connect(peerId: string) {
    let attempt = 1;

    // Chrome bug causes connections to never trigger correctly, attempt 3 times.
    while (true) {
      logDebug(`Establishing connection to ${peerId}. Attempt ${attempt}/3.`);

      try {
        await __PeerConnectionManager__._establishConnection(peerId);
        break;
      } catch (e) {
        if (e.name === TIMEOUT_ERROR && attempt <= 3) {
          attempt++;
        } else {
          throw e;
        }
      }
    }

    if (!__PeerConnectionManager__.peers.hasOwnProperty(peerId)) {
      throw new Error(`Failed to establish connection to ${peerId}`);
    }
  },

  async send(peerId: string, payload: any): Promise<any> {
    const peerConn = __PeerConnectionManager__.peers[peerId];

    if (!peerConn) {
      logError(`Failed to send message to ${peerId}, no connection exists.`);
      logDebug("PeerConnectionManager.peers", __PeerConnectionManager__.peers);
      throw new Error(
        `Cannot send message to ${peerId}, no connection exists.`
      );
    }

    const res = await __PeerConnectionManager__._messageHandler.send(
      peerConn,
      payload
    );

    if (!res.success) {
      const { name, message } = res.error;
      throw new PeerError(message, name);
    }

    return res.payload;
  },

  broadcast(payload: any): Promise<PromiseSettledResult<any>[]> {
    const res = [];

    for (const peerId in __PeerConnectionManager__.peers) {
      res.push(__PeerConnectionManager__.send(peerId, payload));
    }

    return Promise.allSettled(res);
  },

  clearConnections() {
    __PeerConnectionManager__.peers = {};
  },

  removeConnection(peerId: string) {
    if (__PeerConnectionManager__.peers[peerId]) {
      delete __PeerConnectionManager__.peers[peerId];
    }
  },

  _establishConnection(peerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!__PeerConnectionManager__.conn) {
        reject("Cannot connect to peer without first calling register.");
        return;
      }

      const peerConn = __PeerConnectionManager__.conn.connect(peerId);
      const timeoutId = setTimeout(() => {
        reject(new TimeoutError(5000));
      }, 5000);

      peerConn.on("open", () => {
        clearTimeout(timeoutId);

        if (!__PeerConnectionManager__.peers.hasOwnProperty(peerId)) {
          logDebug(`Peer connection opened to ${peerId}`);

          peerConn.on("data", data =>
            __PeerConnectionManager__._handleReceiveData(peerConn, data)
          );

          __PeerConnectionManager__.peers[peerId] = peerConn;

          resolve();
        }
      });

      peerConn.on("error", err => {
        console.error(err);
        reject(err);
      });
    });
  },

  // Event handlers
  onReceiveConnection(fn: (dataConnection: Peer.DataConnection) => void) {
    __PeerConnectionManager__._connectionHandlers.push(fn);
  },

  _handleReceiveData(conn: Peer.DataConnection, data: any) {
    const request = __PeerConnectionManager__._messageHandler.handleMessage(
      conn,
      data
    );
    if (request) {
      const { messageId, action, payload } = request;
      // Route to action
      const respond = (payload?: any) => {
        __PeerConnectionManager__._messageHandler.respond(
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
        __PeerConnectionManager__._messageHandler.respond(
          conn,
          {
            action,
            success: false,
            error: error.toJSON(), // json-immutable doesn't seem to handle __PeerConnectionManager__ automatically
          },
          messageId
        );
      };
      handleAction(action, { peerId: conn.peer, payload, respond, error });
    }
  },

  _handleReceiveConnection(conn: DataConnection) {
    logDebug(`New connection from peer ${conn.peer}`);

    __PeerConnectionManager__.peers[conn.peer] = conn;

    conn.on("data", data =>
      __PeerConnectionManager__._handleReceiveData(conn, data)
    );

    __PeerConnectionManager__._connectionHandlers.forEach(fn => {
      fn(conn);
    });
  },
};

if (!window.__PeerConnectionManager__) {
  // Persists across fast reloads
  window.__PeerConnectionManager__ = __PeerConnectionManager__;
}

export const PeerConnectionManager = window.__PeerConnectionManager__;
