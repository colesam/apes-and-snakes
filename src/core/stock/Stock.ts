import { last } from "lodash";
import { logWarning } from "../../util/log";
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
  newPairCards: Card[];
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
  public newPairCards;
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
      newPairCards = [],
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
    this.newPairCards = newPairCards;
    this.solvedHand = solvedHand;
    this.buyVolume = buyVolume;
    this.sellVolume = sellVolume;
  }

  setPair(pair: Pair, flop: Flop) {
    this.pair = pair;
    this.newPairCards = [...pair.cards];
    this.updateSolvedHand(flop);
  }

  updateSolvedHand(flop: Flop) {
    if (this.pair.cards.length !== 2) {
      logWarning("-- this.pair.cards --", this.pair.cards);
    }
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
    return this.solvedHand
      ? this.solvedHand.cardStrings.map(card => cardFromString(card))
      : [];
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
