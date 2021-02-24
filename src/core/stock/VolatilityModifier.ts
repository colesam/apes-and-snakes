import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";

export type TVolatilityModifier = {
  value: number;
  expirationTick: number;
};

export interface VolatilityModifier extends DeepReadonly<TVolatilityModifier> {}

export class VolatilityModifier extends ImmutableRecord<TVolatilityModifier> {}
