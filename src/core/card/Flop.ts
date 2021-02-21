import { DeepReadonly } from "../ImmutableRecord";
import { Card } from "./Card";
import { CardCombination } from "./CardCombination";

type TFlop = {
  cards: [Card, Card, Card, Card, Card];
};

export interface Flop extends DeepReadonly<TFlop> {}

export class Flop extends CardCombination<TFlop> {
  get cards() {
    return this.data.cards;
  }
}
