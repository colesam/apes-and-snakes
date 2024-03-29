import { groupBy } from "lodash";
import { TICKS_PER_WEEK, WEEKEND_END, WEEKEND_START } from "../config";
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

export const withCommas = (x: number) =>
  x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatCurrency = (x: number) => "$" + withCommas(x);

export const formatCurrencyNoDecimal = (x: number) =>
  formatCurrency(x).slice(0, -3);

export const isWeekend = (tick: number) => {
  const relativeTick = tick % TICKS_PER_WEEK;
  return (
    relativeTick >= Math.floor(WEEKEND_START * TICKS_PER_WEEK) &&
    relativeTick <= Math.floor(WEEKEND_END * TICKS_PER_WEEK)
  );
};

export const isStartOfWeek = (tick: number) => {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === 0;
};

export const isWeekendStart = (tick: number) => {
  const relativeTick = tick % TICKS_PER_WEEK;
  return relativeTick === Math.floor(WEEKEND_START * TICKS_PER_WEEK) - 1;
};

export const isEndOfWeek = (tick: number) => {
  return tick % TICKS_PER_WEEK === TICKS_PER_WEEK - 1;
};

export const lengthInBytes = (str: string): number => {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
};

export const lengthInKb = (str: string): number => lengthInBytes(str) / 1000;

export const mapValuesToArray = <K, V>(map: Map<K, V>): V[] =>
  Array.from(map).map(([, val]) => val);

export const compactPrice = (price: number): string => {
  if (price > 1_000_000) {
    return `${(price / 1_000_000).toFixed(2)}M`;
  } else {
    return `${Math.ceil(price / 1_000)}K`;
  }
};
