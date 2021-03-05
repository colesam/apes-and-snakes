import { ImmerClass } from "../ImmerClass";

interface TParams {
  playerId: string;
  peerId: string;
  lastPing: Date | null;
}

export class PlayerConnection extends ImmerClass {
  protected readonly __class = "PlayerConnection";

  public playerId;
  public peerId;
  public lastPing;

  constructor(
    { playerId = "", peerId = "", lastPing = null } = {} as Partial<TParams>
  ) {
    super();
    this.playerId = playerId;
    this.peerId = peerId;
    this.lastPing = lastPing;
  }
}
