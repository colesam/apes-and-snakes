import { CardCombination } from "./CardCombination";
import { Flop } from "./Flop";
import { Pair } from "./Pair";

interface TParams {
  pair: Pair;
  flop: Flop;
}

export class Hand extends CardCombination {
  protected readonly __class = "Hand";

  public pair;
  public flop;

  constructor(
    { pair = new Pair(), flop = new Flop() } = {} as Partial<TParams>
  ) {
    super();
    this.pair = pair;
    this.flop = flop;
  }

  get cards() {
    return [...this.pair.cards, ...this.flop.cards];
  }
}
