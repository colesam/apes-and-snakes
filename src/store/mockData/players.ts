import { ConnectionStatus } from "../../core/player/ConnectionStatus";
import { Player } from "../../core/player/Player";

export const players = [
  new Player({
    id: "1234",
    name: "Sam Cole",
    connectionStatus: ConnectionStatus.CONNECTED,
    positions: [],
  }),
  new Player({
    id: "1235",
    name: "Samantha Cole",
    connectionStatus: ConnectionStatus.CONNECTED,
    positions: [],
  }),
  new Player({
    id: "1236",
    name: "Samwise Cole",
    connectionStatus: ConnectionStatus.CONNECTED,
    positions: [],
  }),
  new Player({
    id: "1237",
    name: "Samuel Cole",
    connectionStatus: ConnectionStatus.UNRESPONSIVE,
    positions: [],
  }),
  new Player({
    id: "1238",
    name: "Sammy Cole",
    connectionStatus: ConnectionStatus.CONNECTION_LOST,
    positions: [],
  }),
];
