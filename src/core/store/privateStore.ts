import create from "zustand";
import { devtools } from "zustand/middleware";
import initStorage from "../localStorage";
import generateId from "../generateId";
import { Map } from "immutable";

const [storageGet, storageSet] = initStorage("sessionStorage", "privateStore");

/**
 * Data in this store is specific/private to this user, and is not shared with
 * other peers.
 */
export type PrivateState = {
  // Host state
  isHost: boolean;
  secretKeyPlayerIdMap: Map<string, string>; // secretKey -> playerId
  playerIdPeerIdMap: Map<string, string>; // playerId -> peerId

  // Player state
  hostPeerId: string;
  secretKey: string;
  playerId: string;
};

const privateState = {
  isHost: false,
  secretKeyPlayerIdMap: Map<string, string>(),
  playerIdPeerIdMap: Map<string, string>(),

  hostPeerId: "",
  secretKey: storageSet("secretKey", generateId()),
  playerId: "",
};

export const usePrivateStore = create<PrivateState>(
  devtools(() => privateState, "Private Store")
);

export const getPrivate = usePrivateStore.getState;
export const setPrivate = usePrivateStore.setState;
export const resetPrivateStore = () => setPrivate(privateState);

// TODO: Refactor below into some sort of middleware
// Initialize state from local storage
const initialStorageState = {};
for (const key in privateState) {
  const val = storageGet(key);
  if (val !== null) {
    // @ts-ignore
    initialStorageState[key] = val;
  }
}
setPrivate(initialStorageState);

// Set up local storage persistance
usePrivateStore.subscribe((newState, oldState) => {
  // This middleware assumes that I am not dynamically adding keys to the root of the store
  for (const [key, value] of Object.entries(newState)) {
    // @ts-ignore
    if (!oldState.hasOwnProperty(key) || oldState[key] !== value) {
      storageSet(key, value);
    }
  }
});
