import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";
import { ConnectionStatus } from "./ConnectionStatus";

export type TPlayer = {
  id: string;
  name: string;
  connectionStatus: ConnectionStatus;
};

export interface Player extends DeepReadonly<TPlayer> {}

export class Player extends ImmutableRecord<TPlayer> {}
