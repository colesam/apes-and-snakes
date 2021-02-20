import { Card } from "./Card";
import { CardCombination } from "./CardCombination";

type Data = {
  cards: [Card, Card];
};

export class Pair extends CardCombination<Data> {
  constructor(data: Data) {
    super(data, "Pair");
  }

  get cards() {
    return this.data.cards;
  }
}
