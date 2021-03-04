import { Card } from "./Card";
import { CardCombination } from "./CardCombination";

interface TParams {
  cards: [Card, Card];
}

export class Pair extends CardCombination {
  protected readonly __class = "Pair";

  public cards;

  constructor({ cards = [new Card(), new Card()] } = {} as TParams) {
    super();
    this.cards = cards;
  }
}
