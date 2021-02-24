import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";
import { Rank } from "./Rank";
import { Suit } from "./Suit";

type TCard = {
  rank: Rank;
  suit: Suit;
};

export interface Card extends DeepReadonly<TCard> {}

export class Card extends ImmutableRecord<TCard> {
  constructor(data?: Partial<TCard>) {
    super(
      {
        rank: Rank.ACE,
        suit: Suit.SPADES,
      },
      data
    );
  }

  toString() {
    return this.rank + this.suit;
  }
}

export const cardFromString = (str: string): Card =>
  new Card({ rank: str[0] as Rank, suit: str[1] as Suit });
