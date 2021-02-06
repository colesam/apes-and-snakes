import { List } from "immutable";
import { RPlayer } from "./types/Player";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getPrivate } from "./privateStore";
import initStorage from "../localStorage";

const [storageGet, storageSet] = initStorage("sessionStorage", "sharedStore");

/**
 * Data in this store is shared between peers.
 */
export type SharedState = {
  roomCode: string;
  players: List<RPlayer>;
};

const sharedState = {
  roomCode: "",
  players: List<RPlayer>(),
};

export const useSharedStore = create<SharedState>(
  devtools(() => sharedState, "Shared Store")
);

export const getShared = useSharedStore.getState;
export const setShared = useSharedStore.setState;
export const resetSharedStore = () => setShared(sharedState);

// TODO: Refactor below into some sort of middleware
// Initialize state from local storage
const initialStorageState = {};
for (const key in sharedState) {
  const val = storageGet(key);
  if (val !== null) {
    // @ts-ignore
    initialStorageState[key] = val;
  }
}
setShared(initialStorageState);

// Set up local storage persistance
useSharedStore.subscribe((newState, oldState) => {
  if (getPrivate().isHost) {
    // This middleware assumes that I am not dynamically adding keys to the root of the store
    for (const [key, value] of Object.entries(newState)) {
      // @ts-ignore
      if (!oldState.hasOwnProperty(key) || oldState[key] !== value) {
        storageSet(key, value);
      }
    }
  }
});
