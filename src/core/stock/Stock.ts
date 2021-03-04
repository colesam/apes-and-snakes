import { ImmerClass } from "../ImmerClass";
import { Pair } from "../card/Pair";
import { RoundRank } from "../poker";

export class Stock extends ImmerClass {
  protected readonly __class = "Stock";
  constructor(
    public name: string = "",
    public ticker: string = "",
    public priceHistory: number[] = [],
    public rankHistory: RoundRank[] = [],
    public pair: Pair = new Pair(),
    public pairIsNew: boolean = false
  ) {
    super();
  }
}
