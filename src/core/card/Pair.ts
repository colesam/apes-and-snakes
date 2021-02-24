import { DeepReadonly } from "../ImmutableRecord";
import { Card } from "./Card";
import { CardCombination } from "./CardCombination";

type TPair = {
  cards: [Card, Card];
};

export interface Pair extends DeepReadonly<TPair> {}

export class Pair extends CardCombination<TPair> {
  constructor(data?: Partial<TPair>) {
    super({ cards: [new Card(), new Card()] }, data);
  }
  get cards() {
    return this.data.cards;
  }
}
