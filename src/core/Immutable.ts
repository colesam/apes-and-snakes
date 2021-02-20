export abstract class Immutable<T> {
  protected constructor(protected data: T, protected __class: string) {}
}
