import { ImmerClass } from "../ImmerClass";

interface TParams {
  value: number;
  expirationTick: number;
}

export class VolatilityModifier extends ImmerClass {
  protected readonly __class = "VolatilityModifier";

  public value;
  public expirationTick;

  constructor({ value = 0, expirationTick = 0 } = {} as Partial<TParams>) {
    super();
    this.value = value;
    this.expirationTick = expirationTick;
  }
}
