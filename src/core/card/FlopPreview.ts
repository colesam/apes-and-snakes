import { Card } from "./Card";
import { CardCombination } from "./CardCombination";

interface TParams {
  cards: [Card, Card, Card];
}

export class FlopPreview extends CardCombination {
  protected readonly __class = "FlopPreview";

  public cards;

  constructor(
    { cards = [new Card(), new Card(), new Card()] } = {} as Partial<TParams>
  ) {
    super();
    this.cards = cards;
  }
}
