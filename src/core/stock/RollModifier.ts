import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";

export type TRollModifier = {
  value: number;
  expirationTick: number;
};

export interface RollModifier extends DeepReadonly<TRollModifier> {}

export class RollModifier extends ImmutableRecord<TRollModifier> {}
