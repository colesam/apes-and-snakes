import { Map } from "immutable";
import create from "zustand";
import { devtools } from "zustand/middleware";
import generateId from "../generateId";
import { diff } from "../helpers";
import initStorage from "../localStorage";
import { RPlayerConnection } from "./types/PlayerConnection";

const [storageGet, storageSet] = initStorage("sessionStorage", "privateStore");

/**
 * Data in this store is specific/private to this user, and is not shared with
 * other peers.
 */
export type PrivateState = {
  // Host state
  isHost: boolean;
  secretKeyPlayerIdMap: Map<string, string>;
  playerConnections: Map<string, RPlayerConnection>;

  // Player state
  hostPeerId: string;
  previousRoomCode: string;
  playerId: string;
  pingIntervalId: NodeJS.Timeout | null;
  secretKey: string;
};

const privateState = {
  // Host state
  isHost: false,
  secretKeyPlayerIdMap: Map<string, string>(),
  playerConnections: Map<string, RPlayerConnection>(),

  // Player state
  hostPeerId: "",
  previousRoomCode: "",
  playerId: "",
  pingIntervalId: null,
  secretKey: storageGet("secretKey") || storageSet("secretKey", generateId()),
};

export const usePrivateStore = create<PrivateState>(
  // @ts-ignore See: https://github.com/microsoft/TypeScript/issues/19360
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
const exclude = ["pingIntervalId", "hostPeerId", "playerConnections"];
usePrivateStore.subscribe((newState, oldState) => {
  const stateChanges = diff(newState, oldState);
  for (const [key, value] of Object.entries(stateChanges)) {
    if (!exclude.includes(key)) {
      storageSet(key, value);
    }
  }
});
