import { produce, immerable } from "immer";

export abstract class ImmerClass {
  [immerable] = true;

  set(fn: (draft: this) => void) {
    return produce(this, fn);
  }

  merge(updates: Partial<this>) {
    for (const key in updates) {
      if (this.hasOwnProperty(key)) {
        // @ts-ignore
        this[key] = updates[key];
      }
    }
  }
}
