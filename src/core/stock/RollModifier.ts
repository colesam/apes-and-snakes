import { ImmerClass } from "../ImmerClass";

export class RollModifier extends ImmerClass {
  protected readonly __class = "RollModifier";

  constructor(
    public value: number = 0,
    public expirationTick: number = 0,
    public stackKey: string | null = null
  ) {
    super();
  }
}
