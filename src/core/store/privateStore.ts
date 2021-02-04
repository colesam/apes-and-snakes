import { List } from "immutable";
import create from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Data in this store is specific/private to this user, and is not shared with
 * other peers.
 */
export type PrivateState = {
  isHost: boolean;
  playerKeys: List<string>;
};

const privateState = {
  isHost: false,
  playerKeys: List<string>(),
};

export const usePrivateStore = create<PrivateState>(
  devtools(() => privateState, "Private Store")
);

export const getPrivate = usePrivateStore.getState;
export const setPrivate = usePrivateStore.setState;
