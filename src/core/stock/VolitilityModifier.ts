import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";

export type TVolitilityModifier = {
  value: number;
  expirationTick: number;
};

export interface VolitilityModifier extends DeepReadonly<TVolitilityModifier> {}

export class VolitilityModifier extends ImmutableRecord<TVolitilityModifier> {}
