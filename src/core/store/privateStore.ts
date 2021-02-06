import create from "zustand";
import { devtools } from "zustand/middleware";
import initStorage from "../localStorage";
import generateId from "../generateId";
import { Map } from "immutable";
import { diff } from "../helpers";

const [storageGet, storageSet] = initStorage("sessionStorage", "privateStore");

/**
 * Data in this store is specific/private to this user, and is not shared with
 * other peers.
 */
export type PrivateState = {
  // Host state
  isHost: boolean;
  secretKeyPlayerIdMap: Map<string, string>;
  playerIdPeerIdMap: Map<string, string>;

  // Player state
  hostPeerId: string;
  previousRoomCode: string;
  playerId: string;
  secretKey: string;
};

const privateState = {
  // Host state
  isHost: false,
  secretKeyPlayerIdMap: Map<string, string>(),
  playerIdPeerIdMap: Map<string, string>(),

  // Player state
  hostPeerId: "",
  previousRoomCode: "",
  playerId: "",
  secretKey: storageGet("secretKey") || storageSet("secretKey", generateId()),
};

export const usePrivateStore = create<PrivateState>(
  devtools(() => privateState, "Private Store")
);

export const getPrivate = usePrivateStore.getState;
export const setPrivate = usePrivateStore.setState;
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
usePrivateStore.subscribe((newState, oldState) => {
  const stateChanges = diff(newState, oldState);
  for (const [key, value] of Object.entries(stateChanges)) {
    storageSet(key, value);
  }
});
