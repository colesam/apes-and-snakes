import { List } from "immutable";
import { Player } from "../types/Player";
import { ConnectionStatus } from "../types/ConnectionStatus";

export const players = List([
  Player({
    id: "1234",
    name: "Sam Cole",
    connectionStatus: ConnectionStatus.CONNECTED,
  }),
  Player({
    id: "1234",
    name: "Samantha Cole",
    connectionStatus: ConnectionStatus.CONNECTED,
  }),
  Player({
    id: "1235",
    name: "Samwise Cole",
    connectionStatus: ConnectionStatus.CONNECTING,
  }),
  Player({
    id: "1236",
    name: "Samuel Cole",
    connectionStatus: ConnectionStatus.UNRESPONSIVE,
  }),
  Player({
    id: "1237",
    name: "Sammy Cole",
    connectionStatus: ConnectionStatus.CONNECTION_LOST,
  }),
]);
