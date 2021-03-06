import { groupBy } from "lodash";
import PeerError from "../peer/error/PeerError";
import { RollModifier } from "./stock/RollModifier";

export const diff = <T>(newState: T, oldState: T): Partial<T> => {
  const stateChanges: Partial<T> = {};

  for (const [key, value] of Object.entries(newState)) {
    // @ts-ignore
    if (!oldState.hasOwnProperty(key) || oldState[key] !== value) {
      // @ts-ignore
      stateChanges[key] = value;
    }
  }

  return stateChanges;
};

export const errorLog = (e: PeerError) => e && console.error(e.toString());

const splitInto = (num: number, split: number) => {
  const isNegative = num < 0;
  const res = [];
  let absNum = Math.abs(num);

  while (absNum > split) {
    res.push(split);
    absNum -= split;
  }

  if (absNum > 0) res.push(absNum);

  return isNegative ? res.map(n => n * -1) : res;
};

// TODO: move
export const stackRollMods = (mods: RollModifier[]): number[] => {
  const nonStackableMods = mods.filter(m => m.stackKey === null);
  const stackableMods = mods.filter(m => m.stackKey !== null);

  const stackedMods = Object.values(groupBy(stackableMods, "stackKey")).flatMap(
    mods => {
      let modSum = mods.reduce((acc, m) => acc + m.value, 0);
      return splitInto(modSum, 2);
    }
  );

  return [...nonStackableMods.map(m => m.value), ...stackedMods];
};
