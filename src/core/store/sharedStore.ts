import { List } from "immutable";
import { RPlayer } from "./types/Player";
import create from "zustand";
import { devtools } from "zustand/middleware";

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
