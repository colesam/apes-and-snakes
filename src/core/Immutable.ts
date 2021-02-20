export abstract class Immutable<T> {
  protected constructor(protected data: T, protected __class: string) {}
}

export const deserialize = (str: string, classMap: any) => {
  return JSON.parse(str, (k, v) => {
    if (v instanceof Object && v.__class && v.data) {
      if (!classMap.hasOwnProperty(v.__class)) {
        throw new Error(
          `Class missing from classMap. Failed to deserialize __class:"${v.__class}"`
        );
      }
      return new classMap[v.__class](v.data);
    } else {
      return v;
    }
  });
};
