import create from "zustand";
import { devtools } from "zustand/middleware";
import initStorage from "../localStorage";
import { nanoid } from "nanoid";
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
  secretKey: string;
  playerId: string;
};

const privateState = {
  isHost: storageGet("isHost") || false,
  secretKeyPlayerIdMap: storageGet("secretKeyPlayerIdMap") || Map(),
  playerIdPeerIdMap: storageGet("playerIdPeerIdMap") || Map(),

  secretKey: storageGet("secretKey") || storageSet("secretKey", nanoid()),
  playerId: storageGet("playerId") || "",
};

export const usePrivateStore = create<PrivateState>(
  devtools(() => privateState, "Private Store")
);

export const getPrivate = usePrivateStore.getState;
export const setPrivate = usePrivateStore.setState;

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
