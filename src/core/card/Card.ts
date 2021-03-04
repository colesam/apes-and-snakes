import { ImmerClass } from "../ImmerClass";
import { Rank } from "./Rank";
import { Suit } from "./Suit";

interface TParams {
  rank: Rank;
  suit: Suit;
}

export class Card extends ImmerClass {
  protected readonly __class = "Card";

  public rank;
  public suit;

  constructor({ rank = Rank.X, suit = Suit.X } = {} as Partial<TParams>) {
    super();
    this.rank = rank;
    this.suit = suit;
  }

  toString() {
    return this.rank + this.suit;
  }
}

export const cardFromString = (str: string): Card =>
  new Card({ rank: str[0] as Rank, suit: str[1] as Suit });
