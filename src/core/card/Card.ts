import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";
import { Rank } from "./Rank";
import { Suit } from "./Suit";

type TCard = {
  rank: Rank;
  suit: Suit;
};

export interface Card extends DeepReadonly<TCard> {}

export class Card extends ImmutableRecord<TCard> {
  toString() {
    return this.rank + this.suit;
  }
}
