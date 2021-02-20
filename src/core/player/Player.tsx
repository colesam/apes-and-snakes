import { Immutable } from "../Immutable";
import { ConnectionStatus } from "./ConnectionStatus";

export type PlayerData = {
  id: string;
  name: string;
  connectionStatus: ConnectionStatus;
};

export class Player extends Immutable<PlayerData> {
  constructor(data: PlayerData) {
    super(data, "Player");
  }

  get id() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  get connectionStatus() {
    return this.data.connectionStatus;
  }
}
