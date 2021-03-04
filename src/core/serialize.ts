import { classMap as cardClassMap } from "./card/classMap";
import { classMap as commonClassMap } from "./common/classMap";
import { classMap as playerClassMap } from "./player/classMap";
import { classMap as stockClassMap } from "./stock/classMap";

export const serialize = JSON.stringify;

export const deserialize = (str: string | null, classMap: any) => {
  if (!str) return null;
  return JSON.parse(str, (k, v) => {
    if (v instanceof Object && v.__class) {
      if (!classMap.hasOwnProperty(v.__class)) {
        throw new Error(
          `Class missing from classMap. Failed to deserialize __class:"${v.__class}"`
        );
      }
      return new classMap[v.__class](v);
    } else {
      return v;
    }
  });
};

export const classMap = {
  ...cardClassMap,
  ...playerClassMap,
  ...stockClassMap,
  ...commonClassMap,
};
