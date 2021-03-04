import { ImmerClass } from "../ImmerClass";

export class VolatilityModifier extends ImmerClass {
  protected readonly __class = "VolatilityModifier";

  constructor(public value: number = 0, public expirationTick: number = 0) {
    super();
  }
}
