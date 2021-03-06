import { produce } from "immer";
import { getStateConfig, TStore, TStoreKey } from "../store";

export const syncedState = (s: Partial<TStore>) =>
  produce(s, draft => {
    for (let key of Object.keys(draft) as TStoreKey[]) {
      if (!getStateConfig(key).peerSync) {
        delete draft[key];
      }
    }
  });
