import { Record, RecordOf } from "immutable";

export enum ConnectionStatus {
  CONNECTED = "CONNECTED",
  CONNECTING = "CONNECTING",
  UNRESPONSIVE = "UNRESPONSIVE",
  CONNECTION_LOST = "CONNECTION_LOST",
}

export type TPlayerConnection = {
  playerId: string;
  peerId: string;
  lastPing: Date | null;
  connectionStatus: ConnectionStatus;
};

export type RPlayerConnection = RecordOf<TPlayerConnection>;

export const PlayerConnection = Record<TPlayerConnection>(
  {
    playerId: "",
    peerId: "",
    lastPing: null,
    connectionStatus: ConnectionStatus.CONNECTING,
  },
  "PlayerConnection"
);
