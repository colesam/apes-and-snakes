import { DeepReadonly } from "../ImmutableRecord";
import { CardCombination } from "./CardCombination";
import { Flop } from "./Flop";
import { Pair } from "./Pair";

type THand = {
  pair: Pair;
  flop: Flop;
};

export interface Hand extends DeepReadonly<THand> {}

export class Hand extends CardCombination<THand> {
  get cards() {
    return [...this.data.pair.cards, ...this.data.flop.cards];
  }
}
