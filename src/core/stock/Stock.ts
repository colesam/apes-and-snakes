import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";
import { Pair } from "../card/Pair";
import { RoundRank } from "../poker";

export type TStock = {
  name: string;
  ticker: string;
  priceHistory: number[];
  rankHistory: RoundRank[];
  pair: Pair;
};

export interface Stock extends DeepReadonly<TStock> {}

export class Stock extends ImmutableRecord<TStock> {}
