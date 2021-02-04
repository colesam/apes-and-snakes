// @ts-ignore
import { serialize } from "json-immutable/lib/serialize";
// @ts-ignore
import { deserialize } from "json-immutable/lib/deserialize";
import recordTypes from "./store/types/recordTypes";

type Get = (key: string) => any;
type Set = (key: string, value: any) => void;

const initStorage = (
  type: "localStorage" | "sessionStorage",
  namespace: string
): [Get, Set] => {
  const storageApi = window[type];

  if (!storageApi) {
    throw new Error(`Failed to initialize window.${type}`);
  }

  const get = (key: string) =>
    deserialize(storageApi.getItem(`${namespace}_${key}`), {
      recordTypes,
    });

  const set = (key: string, value: any) =>
    storageApi.setItem(`${namespace}_${key}`, serialize(value));

  return [get, set];
};

export default initStorage;
