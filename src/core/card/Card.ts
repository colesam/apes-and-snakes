import { ImmerClass } from "../ImmerClass";
import { Rank } from "./Rank";
import { Suit } from "./Suit";

export class Card extends ImmerClass {
  protected readonly __class = "Card";

  constructor(public rank: Rank = Rank.X, public suit: Suit = Suit.X) {
    super();
  }

  toString() {
    return this.rank + this.suit;
  }
}

export const cardFromString = (str: string): Card =>
  new Card(str[0] as Rank, str[1] as Suit);
