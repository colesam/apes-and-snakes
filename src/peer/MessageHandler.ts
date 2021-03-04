import { nanoid } from "nanoid";
import Peer from "peerjs";
import { serialize, deserialize, classMap } from "../core/serialize";
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
        console.log(`[DEBUG] Message failed to send!`);
        console.log("-- payload --");
        console.log(payload);
        console.log("-- conn.peer --");
        console.log(conn.peer);
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
