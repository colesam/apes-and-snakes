import { Card } from "./Card";
import { CardCombination } from "./CardCombination";

interface TParams {
  cards: Card[];
  rank: number;
  descr: string;
  name: string;
}

export class SolvedHand extends CardCombination {
  protected readonly __class = "SolvedHand";

  public cards;
  public rank;
  public descr;
  public name;

  constructor(
    { cards = [], rank = -1, descr = "", name = "" } = {} as Partial<TParams>
  ) {
    super();
    this.cards = cards;
    this.rank = rank;
    this.descr = descr;
    this.name = name;
  }
}
