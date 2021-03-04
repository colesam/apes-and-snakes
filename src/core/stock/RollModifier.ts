import { ImmerClass } from "../ImmerClass";

interface TParams {
  value: number;
  expirationTick: number;
  stackKey: string | null;
}

export class RollModifier extends ImmerClass {
  protected readonly __class = "RollModifier";

  public value;
  public expirationTick;
  public stackKey;

  constructor(
    { value = 0, expirationTick = 0, stackKey = null } = {} as Partial<TParams>
  ) {
    super();
    this.value = value;
    this.expirationTick = expirationTick;
    this.stackKey = stackKey;
  }
}
