import { Immutable } from "../Immutable";

export type PlayerConnectionData = {
  playerId: string;
  peerId: string;
  lastPing: Date | null;
};

const defaults = {
  playerId: "",
  peerId: "",
  lastPing: null,
};

export class PlayerConnection extends Immutable<PlayerConnectionData> {
  constructor(data?: PlayerConnectionData) {
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
