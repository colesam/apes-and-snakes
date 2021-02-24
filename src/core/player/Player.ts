import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";
import generateId from "../generateId";
import { Position } from "../stock/Position";
import { ConnectionStatus } from "./ConnectionStatus";

export type TPlayer = {
  id: string;
  name: string;
  connectionStatus: ConnectionStatus;
  positions: Position[];
};

export interface Player extends DeepReadonly<TPlayer> {}

export class Player extends ImmutableRecord<TPlayer> {
  constructor(data?: Partial<TPlayer>) {
    super(
      {
        id: generateId(),
        name: "",
        connectionStatus: ConnectionStatus.CONNECTED,
        positions: [],
      },
      data
    );
  }
}
