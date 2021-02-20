import { Immutable } from "../Immutable";
import { Card } from "./Card";

export abstract class CardCombination<T> extends Immutable<T> {
  abstract get cards(): Card[];

  get cardStrings() {
    return this.cards.map(card => card.toString());
  }

  get key() {
    return this.cardStrings.sort().join("_");
  }
}
