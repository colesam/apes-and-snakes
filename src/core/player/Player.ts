import { ImmerClass } from "../ImmerClass";
import { Position } from "../stock/Position";
import { ConnectionStatus } from "./ConnectionStatus";

export class Player extends ImmerClass {
  protected readonly __class = "Player";

  constructor(
    public id: string,
    public name: string,
    public connectionStatus: ConnectionStatus,
    public position: Position[],
    public cash: number
  ) {
    super();
  }
}
