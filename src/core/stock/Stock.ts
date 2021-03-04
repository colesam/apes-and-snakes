import { ImmerClass } from "../ImmerClass";
import { Pair } from "../card/Pair";
import { RoundRank } from "../poker";

interface TParams {
  name: string;
  ticker: string;
  priceHistory: number[];
  rankHistory: RoundRank[];
  pair: Pair;
  pairIsNew: boolean;
}

export class Stock extends ImmerClass {
  protected readonly __class = "Stock";

  public name;
  public ticker;
  public priceHistory;
  public rankHistory;
  public pair;
  public pairIsNew;

  constructor(
    {
      name = "",
      ticker = "",
      priceHistory = [],
      rankHistory = [],
      pair = new Pair(),
      pairIsNew = false,
    } = {} as Partial<TParams>
  ) {
    super();
    this.name = name;
    this.ticker = ticker;
    this.priceHistory = priceHistory;
    this.rankHistory = rankHistory;
    this.pair = pair;
    this.pairIsNew = pairIsNew;
  }
}
