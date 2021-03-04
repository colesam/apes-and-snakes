import { ImmerClass } from "../ImmerClass";

export class PlayerConnection extends ImmerClass {
  protected readonly __class = "PlayerConnection";

  constructor(
    public playerId: string = "",
    public peerId: string = "",
    public lastPing: Date | null = null
  ) {
    super();
  }
}
