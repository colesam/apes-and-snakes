import { Card } from "./Card";
import { CardCombination } from "./CardCombination";

type Data = {
  cards: [Card, Card, Card, Card, Card];
};

export class Flop extends CardCombination<Data> {
  constructor(data: Data) {
    super(data, "Flop");
  }

  get cards() {
    return this.data.cards;
  }
}
