// @ts-ignore
import { serialize } from "json-immutable/lib/serialize";
// @ts-ignore
import { deserialize } from "json-immutable/lib/deserialize";
import recordTypes from "./store/types/recordTypes";

type Get = (key: string) => any;
type Set = <T>(key: string, value: T) => T;

const initStorage = (
  type: "localStorage" | "sessionStorage",
  namespace: string
): [Get, Set] => {
  const storageApi = window[type];

  if (!storageApi) {
    throw new Error(`Failed to initialize window.${type}`);
  }

  const get: Get = key =>
    deserialize(storageApi.getItem(`${namespace}_${key}`), {
      recordTypes,
    });

  const set: Set = (key, value) => {
    storageApi.setItem(`${namespace}_${key}`, serialize(value));
    return value;
  };

  return [get, set];
};

export default initStorage;
