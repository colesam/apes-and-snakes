import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";

export type TVolatilityModifier = {
  value: number;
  expirationTick: number;
};

export interface VolatilityModifier extends DeepReadonly<TVolatilityModifier> {}

export class VolatilityModifier extends ImmutableRecord<TVolatilityModifier> {
  constructor(data?: Partial<TVolatilityModifier>) {
    super({ value: 0, expirationTick: 0 }, data, "VolatilityModifier");
  }
}
