import { serialize, deserialize, classMap } from "./serialize";

type Get = (key: string) => any;
type Set = <T>(key: string, value: T) => T;
type Clear = () => void;

const initStorage = (
  type: "localStorage" | "sessionStorage",
  namespace: string
): [Get, Set, Clear] => {
  const storageApi = window[type];

  if (!storageApi) {
    throw new Error(`Failed to initialize window.${type}`);
  }

  const get: Get = key =>
    deserialize(storageApi.getItem(`${namespace}_${key}`), classMap);

  const set: Set = (key, value) => {
    storageApi.setItem(`${namespace}_${key}`, serialize(value));
    return value;
  };

  const clear: Clear = () => {
    storageApi.clear();
  };

  return [get, set, clear];
};

export default initStorage;
