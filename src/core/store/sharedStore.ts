import { List } from "immutable";
import { RPlayer } from "./types/Player";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getPrivate } from "./privateStore";
import initStorage from "../localStorage";
import { PeerAction } from "../peer/PeerAction";
import { diff } from "../helpers";

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
const initialStorageState: any = {};
for (const key in sharedState) {
  const val = storageGet(key);
  if (val !== null) {
    initialStorageState[key] = val;
  }
}
setShared(initialStorageState);

// Set up local storage persistance
useSharedStore.subscribe((newState, oldState) => {
  if (getPrivate().isHost) {
    const stateChanges = diff(newState, oldState);
    for (const [key, value] of Object.entries(stateChanges)) {
      storageSet(key, value);
    }
  }
});

// Automatically emit changes to all peers, if hosting
useSharedStore.subscribe((newState, oldState) => {
  if (getPrivate().isHost) {
    const stateChanges = diff(newState, oldState);
    PeerAction.broadcastShared(stateChanges);
  }
});
