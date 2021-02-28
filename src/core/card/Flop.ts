import { DeepReadonly } from "../ImmutableRecord";
import { Card } from "./Card";
import { CardCombination } from "./CardCombination";
import { FlopPreview } from "./FlopPreview";

type TFlop = {
  cards: [Card, Card, Card, Card, Card];
};

export interface Flop extends DeepReadonly<TFlop> {}

export class Flop extends CardCombination<TFlop> {
  constructor(data?: Partial<TFlop>) {
    super(
      {
        cards: [new Card(), new Card(), new Card(), new Card(), new Card()],
      },
      data,
      "Flop"
    );
  }

  get cards() {
    return this.data.cards;
  }

  get preview() {
    const [a, b, c] = this.cards;
    return new FlopPreview({ cards: [a, b, c] });
  }
}
