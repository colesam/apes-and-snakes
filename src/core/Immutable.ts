export abstract class Immutable<T> {
  protected constructor(protected data: T, protected __class: string) {}

  set(update: Partial<T>): this {
    return this.constructor({ ...this.data, ...update }, this.__class);
  }
}
