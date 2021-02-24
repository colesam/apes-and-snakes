import { isFunction } from "lodash";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { diff } from "../core/helpers";
import initStorage from "../core/localStorage";
import { privateState } from "./privateState";

const [storageGet, storageSet] = initStorage("sessionStorage", "privateStore");

/**
 * Data in this store is specific/private to this user, and is not shared with
 * other peers.
 */

export type PrivateState = typeof privateState;

export const usePrivateStore = create<PrivateState>(
  // @ts-ignore See: https://github.com/microsoft/TypeScript/issues/19360
  devtools(() => privateState, "Private Store")
);

export const getPrivate = usePrivateStore.getState;
export const setPrivate = (
  update: Partial<PrivateState> | ((s: PrivateState) => Partial<PrivateState>)
) => {
  if (isFunction(update)) {
    usePrivateStore.setState(update(getPrivate()));
  } else {
    usePrivateStore.setState(update);
  }
};
export const resetPrivateStore = () => setPrivate(privateState);

// TODO: Refactor below into some sort of middleware
// Initialize state from local storage
const initialStorageState: any = {};
for (const key in privateState) {
  const val = storageGet(key);
  if (val !== null) {
    initialStorageState[key] = val;
  }
}
setPrivate(initialStorageState);

// Set up local storage persistance
const exclude = [
  "pingIntervalId",
  "hostPeerId",
  "playerConnections",
  "stockRollModifierMap",
  "stockVolatilityModifierMap",
  "location",
];
usePrivateStore.subscribe((newState, oldState) => {
  const stateChanges = diff(newState, oldState);
  for (const [key, value] of Object.entries(stateChanges)) {
    if (!exclude.includes(key)) {
      storageSet(key, value);
    }
  }
});
