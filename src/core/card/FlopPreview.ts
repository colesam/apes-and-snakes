import { DeepReadonly } from "../ImmutableRecord";
import { Card } from "./Card";
import { CardCombination } from "./CardCombination";

type TFlopPreview = {
  cards: [Card, Card, Card];
};

export interface FlopPreview extends DeepReadonly<TFlopPreview> {}

export class FlopPreview extends CardCombination<TFlopPreview> {
  constructor(data?: Partial<TFlopPreview>) {
    super(
      {
        cards: [new Card(), new Card(), new Card()],
      },
      data,
      "FlopPreview"
    );
  }

  get cards() {
    return this.data.cards;
  }
}
