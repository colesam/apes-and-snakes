import { Card } from "./Card";
import { CardCombination } from "./CardCombination";
import { FlopPreview } from "./FlopPreview";

interface TParams {
  cards: [Card, Card, Card, Card, Card];
}

export class Flop extends CardCombination {
  protected readonly __class = "Flop";

  public cards;

  constructor(
    {
      cards = [new Card(), new Card(), new Card(), new Card(), new Card()],
    } = {} as Partial<TParams>
  ) {
    super();
    this.cards = cards;
  }

  /**
   * Push a card onto the end of the flop, forcing the first one out.
   */
  pushShift(card: Card): Card {
    this.cards.push(card);
    return this.cards.shift()!;
  }

  get preview() {
    const [a, b, c] = this.cards;
    return new FlopPreview({ cards: [a, b, c] });
  }
}
