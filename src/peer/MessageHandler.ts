import { nanoid } from "nanoid";
import Peer from "peerjs";
import { lengthInKb } from "../core/helpers";
import { serialize, deserialize, classMap } from "../core/serialize";
import { logDebug, logError, logWarning } from "../util/log";
import TimeoutError from "./error/TimeoutError";

export default class MessageHandler {
  constructor(public timeout: number = 10000) {}

  private _messageResolvers: { [key: string]: (data: any) => void } = {};

  send(conn: Peer.DataConnection, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const messageId = nanoid();

      try {
        conn.send(serialize({ messageId: messageId, ...payload }));
      } catch (e) {
        logError("Message failed to send.");
        logDebug("-- payload --", payload);
        logDebug("-- conn.peer --", conn.peer);
        throw e;
      }

      this._messageResolvers[messageId] = resolve;

      setTimeout(() => reject(new TimeoutError(this.timeout)), this.timeout);
    });
  }

  respond(conn: Peer.DataConnection, payload: any, messageId: string) {
    conn.send(serialize({ messageId: messageId, ...payload }));
  }

  handleMessage(conn: Peer.DataConnection, data: string): any | null {
    const len = lengthInKb(data);
    if (len > 5) logWarning(`Received message of size ${len}`, data);

    const message = deserialize(data, classMap);

    if (message.messageId) {
      const resolve = this._messageResolvers[message.messageId];

      if (resolve) {
        // Original sender of message receiving response
        resolve(message);
        delete this._messageResolvers[message.messageId];
        return null;
      } else {
        // Recipient of message
        return message;
      }
    }
  }
}
