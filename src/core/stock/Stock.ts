import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";
import { Pair } from "../card/Pair";

export type TStock = {
  name: string;
  ticker: string;
  change: number;
  priceHistory: number[];
  pair: Pair;
};

export interface Stock extends DeepReadonly<TStock> {}

export class Stock extends ImmutableRecord<TStock> {}
