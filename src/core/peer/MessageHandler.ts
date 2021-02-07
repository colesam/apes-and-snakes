// @ts-ignore
import { serialize } from "json-immutable/lib/serialize";
// @ts-ignore
import { deserialize } from "json-immutable/lib/deserialize";
import { Map } from "immutable";
import Peer from "peerjs";
import { nanoid } from "nanoid";
import recordTypes from "../store/types/recordTypes";

export default class MessageHandler {
  constructor(public timeout: number = 10000) {}

  private _messageResolvers = Map<string, (data: any) => void>();

  send(conn: Peer.DataConnection, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const messageId = nanoid();

      conn.send(serialize({ messageId: messageId, ...payload }));

      this._messageResolvers = this._messageResolvers.set(messageId, resolve);

      setTimeout(
        () =>
          reject({
            message: `Message was sent but no response was received after ${this.timeout}ms`,
            code: "TIMEOUT",
          }),
        this.timeout
      );
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
