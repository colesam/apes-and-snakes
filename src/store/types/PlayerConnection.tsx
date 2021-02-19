import { Record, RecordOf } from "immutable";

export type TPlayerConnection = {
  playerId: string;
  peerId: string;
  lastPing: Date | null;
};

export type RPlayerConnection = RecordOf<TPlayerConnection>;

export const PlayerConnection = Record<TPlayerConnection>(
  {
    playerId: "",
    peerId: "",
    lastPing: null,
  },
  "PlayerConnection"
);
