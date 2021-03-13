import { last } from "lodash";
import { ImmerClass } from "../ImmerClass";
import { getHandBonus } from "../card/BonusHand";
import { Card, cardFromString } from "../card/Card";
import { Flop } from "../card/Flop";
import { Hand } from "../card/Hand";
import { Pair } from "../card/Pair";
import { SolvedHand, solvedHandFromRawData } from "../card/SolvedHand";
import { RoundRank, solveHand } from "../poker";

interface TParams {
  name: string;
  ticker: string;
  priceHistory: number[];
  rankHistory: RoundRank[];
  pair: Pair;
  pairIsNew: boolean;
  solvedHand: SolvedHand | null;
  buyVolume: number;
  sellVolume: number;
}

export class Stock extends ImmerClass {
  protected readonly __class = "Stock";

  public name;
  public ticker;
  public priceHistory;
  public rankHistory;
  public pair;
  public pairIsNew;
  public solvedHand;
  public buyVolume;
  public sellVolume;

  constructor(
    {
      name = "",
      ticker = "",
      priceHistory = [],
      rankHistory = [],
      pair = new Pair(),
      pairIsNew = false,
      solvedHand = null,
      buyVolume = 10_000,
      sellVolume = 10_000,
    } = {} as Partial<TParams>
  ) {
    super();
    this.name = name;
    this.ticker = ticker;
    this.priceHistory = priceHistory;
    this.rankHistory = rankHistory;
    this.pair = pair;
    this.pairIsNew = pairIsNew;
    this.solvedHand = solvedHand;
    this.buyVolume = buyVolume;
    this.sellVolume = sellVolume;
  }

  setPair(pair: Pair, flop: Flop) {
    this.pair = pair;
    this.pairIsNew = true;
    this.updateSolvedHand(flop);
  }

  updateSolvedHand(flop: Flop) {
    this.solvedHand = solvedHandFromRawData(
      solveHand(
        new Hand({
          pair: this.pair,
          flop,
        })
      )
    );
  }

  get handBonus() {
    return this.rank < 4 && this.solvedHand
      ? getHandBonus(this.solvedHand.name)
      : [];
  }

  get relevantFlopCards(): Card[] {
    const pairCardStrings = this.pair.cardStrings;
    return this.solvedHand
      ? this.solvedHand.cardStrings
          .filter(card => !pairCardStrings.includes(card))
          .map(card => cardFromString(card))
      : [];
  }

  get solvedHandRank(): number {
    return this.solvedHand?.rank || -1;
  }

  get price() {
    return last(this.priceHistory) || 0;
  }

  get rank() {
    return last(this.rankHistory) || 1;
  }

  get hasBuySqueeze() {
    return this.buyVolume < 1_000;
  }

  get hasSellSqueeze() {
    return this.sellVolume < 1_000;
  }
}
