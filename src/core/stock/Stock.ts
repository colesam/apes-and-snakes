import { last } from "lodash";
import { ImmerClass } from "../ImmerClass";
import { getHandBonus } from "../card/BonusHand";
import { Pair } from "../card/Pair";
import { RoundRank } from "../poker";

interface TParams {
  name: string;
  ticker: string;
  priceHistory: number[];
  rankHistory: RoundRank[];
  pair: Pair;
  pairIsNew: boolean;
  handDescr: string;
}

export class Stock extends ImmerClass {
  protected readonly __class = "Stock";

  public name;
  public ticker;
  public priceHistory;
  public rankHistory;
  public pair;
  public pairIsNew;
  public handDescr;

  constructor(
    {
      name = "",
      ticker = "",
      priceHistory = [],
      rankHistory = [],
      pair = new Pair(),
      pairIsNew = false,
      handDescr = "",
    } = {} as Partial<TParams>
  ) {
    super();
    this.name = name;
    this.ticker = ticker;
    this.priceHistory = priceHistory;
    this.rankHistory = rankHistory;
    this.pair = pair;
    this.pairIsNew = pairIsNew;
    this.handDescr = handDescr;
  }

  get handBonus() {
    return this.rank < 4 ? getHandBonus(this.handDescr.split(",")[0]) : [];
  }

  get price() {
    return last(this.priceHistory) || 0;
  }

  get rank() {
    return last(this.rankHistory) || 1;
  }
}
