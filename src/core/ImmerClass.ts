import produce, { immerable } from "immer";

export abstract class ImmerClass {
  [immerable] = true;

  set(fn: (draft: this) => void) {
    return produce(this, fn);
  }
}
