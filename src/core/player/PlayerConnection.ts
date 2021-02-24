import { ImmutableRecord } from "../ImmutableRecord";

export type TPlayerConnection = {
  playerId: string;
  peerId: string;
  lastPing: Date | null;
};

const defaults = {
  playerId: "",
  peerId: "",
  lastPing: null,
};

export class PlayerConnection extends ImmutableRecord<TPlayerConnection> {
  constructor(data?: TPlayerConnection) {
    super({ ...defaults, ...data }, "PlayerConnection");
  }

  get playerId() {
    return this.data.playerId;
  }

  get peerId() {
    return this.data.peerId;
  }

  get lastPing() {
    return this.data.lastPing;
  }
}
