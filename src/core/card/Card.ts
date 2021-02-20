import { Immutable } from "../Immutable";
import { Rank } from "./Rank";
import { Suit } from "./Suit";

type Data = {
  rank: Rank;
  suit: Suit;
};

export class Card extends Immutable<Data> {
  constructor(data: Data) {
    super(data, "Card");
  }

  get rank() {
    return this.data.rank;
  }

  get suit() {
    return this.data.suit;
  }

  toString() {
    return this.rank + this.suit;
  }
}
