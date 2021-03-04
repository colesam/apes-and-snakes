import { GuaranteedMap } from "./GuaranteedMap";

interface TParams<K, V> {
  entries?: [K, V][];
}

// Serializable version of GuaranteedMap, hardcoded to use arrays as default value
export class ArrayMap<K, T> extends GuaranteedMap<K, T[]> {
  protected readonly __class = "ArrayMap";

  constructor({ entries } = {} as Partial<TParams<K, T[]>>) {
    super(() => [] as T[], entries);
  }

  toJSON() {
    return {
      __class: this.__class,
      entries: this.toArray(),
    };
  }
}
