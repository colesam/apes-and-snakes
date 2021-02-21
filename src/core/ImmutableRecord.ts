export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

export class ImmutableRecord<T extends object> {
  protected readonly __class: string;

  constructor(protected readonly data: T, __class?: string) {
    if (!__class) {
      this.__class = this.constructor.name;
    } else {
      this.__class = __class;
    }

    return new Proxy(this, {
      get(target, name) {
        if (target.data.hasOwnProperty(name)) {
          const prop = name as keyof typeof target.data;
          return target.data[prop];
        }
        const prop = name as keyof typeof target;
        return target[prop];
      },
    });
  }

  set(update: Partial<T>): this {
    // @ts-ignore
    return new this.constructor({ ...this.data, ...update }, this.__class);
  }
}
