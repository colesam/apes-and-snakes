import { ImmutableRecord } from "../ImmutableRecord";
import { Card } from "./Card";

export abstract class CardCombination<
  T extends object
> extends ImmutableRecord<T> {
  abstract get cards(): Card[];

  get cardStrings() {
    return this.cards.map(card => card.toString());
  }

  get key() {
    return this.cardStrings.sort().join("_");
  }
}
