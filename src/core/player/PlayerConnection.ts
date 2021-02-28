import { ImmutableRecord } from "../ImmutableRecord";

export type TPlayerConnection = {
  playerId: string;
  peerId: string;
  lastPing: Date | null;
};

export class PlayerConnection extends ImmutableRecord<TPlayerConnection> {
  constructor(data?: Partial<TPlayerConnection>) {
    super(
      {
        playerId: "",
        peerId: "",
        lastPing: null,
      },
      data,
      "PlayerConnection"
    );
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
