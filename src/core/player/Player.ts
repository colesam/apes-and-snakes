import { ImmerClass } from "../ImmerClass";
import { Position } from "../stock/Position";
import { ConnectionStatus } from "./ConnectionStatus";

interface TParams {
  id: string;
  name: string;
  connectionStatus: ConnectionStatus;
  position: Position[];
  cash: number;
}

export class Player extends ImmerClass {
  protected readonly __class = "Player";

  public id;
  public name;
  public connectionStatus;
  public position;
  public cash;

  constructor(
    {
      id = "",
      name = "",
      connectionStatus = ConnectionStatus.CONNECTED,
      position = [],
      cash = 0,
    } = {} as Partial<TParams>
  ) {
    super();
    this.id = id;
    this.name = name;
    this.connectionStatus = connectionStatus;
    this.position = position;
    this.cash = cash;
  }
}
