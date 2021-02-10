import { Record, RecordOf } from "immutable";
import { ConnectionStatus } from "./ConnectionStatus";

export type TPlayer = {
  id: string;
  name: string;
  connectionStatus: ConnectionStatus;
};

export type RPlayer = RecordOf<TPlayer>;

export const Player = Record<TPlayer>(
  {
    id: "",
    name: "",
    connectionStatus: ConnectionStatus.CONNECTED,
  },
  "Player"
);
