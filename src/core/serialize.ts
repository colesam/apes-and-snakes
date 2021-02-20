import { classMap as cardClassMap } from "./card/classMap";
import { classMap as playerClassMap } from "./player/classMap";

export const serialize = JSON.stringify;

export const deserialize = (str: string | null, classMap: any) => {
  if (!str) return null;
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

export const immutableClassMap = {
  ...cardClassMap,
  ...playerClassMap,
};
