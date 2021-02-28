import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";

export type TRollModifier = {
  value: number;
  expirationTick: number;
  stackKey: string | null;
};

export interface RollModifier extends DeepReadonly<TRollModifier> {}

export class RollModifier extends ImmutableRecord<TRollModifier> {
  constructor(data?: Partial<TRollModifier>) {
    super({ value: 0, expirationTick: 0, stackKey: null }, data);
  }
}
