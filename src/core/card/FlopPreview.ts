import { Card } from "./Card";
import { CardCombination } from "./CardCombination";

export class FlopPreview extends CardCombination {
  protected readonly __class = "FlopPreview";

  constructor(
    public cards: [Card, Card, Card] = [new Card(), new Card(), new Card()]
  ) {
    super();
  }
}
