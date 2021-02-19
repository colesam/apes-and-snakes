import { List } from "immutable";
import { ConnectionStatus } from "../types/ConnectionStatus";
import { Player } from "../types/Player";

export const players = List([
  Player({
    id: "1234",
    name: "Sam Cole",
    connectionStatus: ConnectionStatus.CONNECTED,
  }),
  Player({
    id: "1235",
    name: "Samantha Cole",
    connectionStatus: ConnectionStatus.CONNECTED,
  }),
  Player({
    id: "1236",
    name: "Samwise Cole",
    connectionStatus: ConnectionStatus.CONNECTED,
  }),
  Player({
    id: "1237",
    name: "Samuel Cole",
    connectionStatus: ConnectionStatus.UNRESPONSIVE,
  }),
  Player({
    id: "1238",
    name: "Sammy Cole",
    connectionStatus: ConnectionStatus.CONNECTION_LOST,
  }),
]);
