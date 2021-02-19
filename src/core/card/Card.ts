import { Rank } from "./Rank";
import { Suit } from "./Suit";

export class Card {
  constructor(public rank: Rank, public suit: Suit) {}

  toString() {
    return this.rank + this.suit;
  }
}
