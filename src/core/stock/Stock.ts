import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";
import { Pair } from "../card/Pair";
import { RoundRank } from "../poker";

export type TStock = {
  name: string;
  ticker: string;
  priceHistory: number[];
  rankHistory: RoundRank[];
  pair: Pair;
  pairIsNew: boolean;
};

export interface Stock extends DeepReadonly<TStock> {}

export class Stock extends ImmutableRecord<TStock> {
  constructor(data?: Partial<TStock>) {
    super(
      {
        name: "",
        ticker: "",
        priceHistory: [],
        rankHistory: [],
        pair: new Pair(),
        pairIsNew: false,
      },
      data
    );
  }
}
