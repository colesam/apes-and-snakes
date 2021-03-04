import { immerable } from "immer";

export class GuaranteedMap<K, V> implements Map<K, V> {
  [immerable] = true;

  [Symbol.iterator] = this.entries;

  [Symbol.toStringTag] = "GuaranteedMap";

  protected readonly default;

  public map;

  constructor(defaultFn: () => V, entries?: [K, V][]) {
    this.default = defaultFn;
    this.map = new Map<K, V>(entries);
  }

  get(key: K): V {
    if (!this.map.has(key)) this.map.set(key, this.default());
    return this.map.get(key)!;
  }

  set(key: K, value: V) {
    this.map.set(key, value);
    return this;
  }

  delete(key: K) {
    return this.map.delete(key);
  }

  has(key: K) {
    return this.map.has(key);
  }

  forEach(fn: (value: V, key: K, map: Map<K, V>) => void) {
    return this.map.forEach(fn);
  }

  clear() {
    this.map.clear();
  }

  keys() {
    return this.map.keys();
  }

  values() {
    return this.map.values();
  }

  entries() {
    return this.map.entries();
  }

  toArray() {
    const arr = [];
    for (let entry of this.map) {
      arr.push(entry);
    }
    return arr;
  }

  get size() {
    return this.map.size;
  }
}

// TODO: Open issue with immer to resolve the extending Map problem
