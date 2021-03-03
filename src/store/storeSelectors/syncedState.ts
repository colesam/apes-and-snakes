import { getStateConfig, TStore, TStoreKey } from "../store";

type Entries<T> = {
  [key in keyof T]: [key, T[key]];
}[keyof T][];

export const syncedState = (s: TStore) =>
  (Object.entries(s) as Entries<TStore>)
    .filter(([key]) => getStateConfig(key).peerSync)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<TStoreKey, TStore[TStoreKey]>) as Partial<TStore>; // TODO: fix
