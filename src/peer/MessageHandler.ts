import { Map } from "immutable";
import { nanoid } from "nanoid";
import Peer from "peerjs";
import { serialize, deserialize } from "../core/immutableJson";
import recordTypes from "../store/types/recordTypes";
import TimeoutError from "./error/TimeoutError";

export default class MessageHandler {
  constructor(public timeout: number = 10000) {}

  private _messageResolvers = Map<string, (data: any) => void>();

  send(conn: Peer.DataConnection, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const messageId = nanoid();

      conn.send(serialize({ messageId: messageId, ...payload }));

      this._messageResolvers = this._messageResolvers.set(messageId, resolve);

      setTimeout(() => reject(new TimeoutError(this.timeout)), this.timeout);
    });
  }

  respond(conn: Peer.DataConnection, payload: any, messageId: string) {
    conn.send(serialize({ messageId: messageId, ...payload }));
  }

  handleMessage(conn: Peer.DataConnection, data: string): any | null {
    const message = deserialize(data, { recordTypes });

    if (message.messageId) {
      const resolve = this._messageResolvers.get(message.messageId);

      if (resolve) {
        // Original sender of message receiving response
        resolve(message);

        this._messageResolvers = this._messageResolvers.delete(
          message.messageId
        );

        return null;
      } else {
        // Recipient of message
        return message;
      }
    }
  }
}