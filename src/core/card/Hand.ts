import { CardCombination } from "./CardCombination";
import { Flop } from "./Flop";
import { Pair } from "./Pair";

type Data = {
  pair: Pair;
  flop: Flop;
};

export class Hand extends CardCombination<Data> {
  constructor(data: Data) {
    super(data, "Hand");
  }

  get pair() {
    return this.data.pair;
  }

  get flop() {
    return this.data.flop;
  }

  get cards() {
    return [...this.pair.cards, ...this.flop.cards];
  }
}
