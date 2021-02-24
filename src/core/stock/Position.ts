import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";

export type TPosition = {
  stockTicker: string;
  quantity: number;
  purchasePrice: number;
};

export interface Position extends DeepReadonly<TPosition> {}

export class Position extends ImmutableRecord<TPosition> {}
