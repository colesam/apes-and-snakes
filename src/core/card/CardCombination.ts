import { ImmerClass } from "../ImmerClass";
import { Card } from "./Card";

export abstract class CardCombination extends ImmerClass {
  abstract get cards(): Card[];

  get cardStrings() {
    return this.cards.map(card => card.toString());
  }

  get key() {
    return this.cardStrings.sort().join("_");
  }
}
