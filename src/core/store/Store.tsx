import create from "zustand";
import { devtools } from "zustand/middleware";
import { RPlayer } from "./types/Player";
import { List } from "immutable";
import { initSync, broadcastData } from "../peer/PeerDataSync";

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

// Helper functions

export const getPrivate = usePrivateStore.getState;
export const getShared = useSharedStore.getState;

export const setPrivate = usePrivateStore.setState;
export const setShared = useSharedStore.setState;

// Actions

export const hostGame = (roomCode: string) => {
  setPrivate({ isHost: true });
  setShared({ roomCode });
};

export const setRoomCode = (roomCode: string) => setShared({ roomCode });

export const pushPlayer = (player: RPlayer) => {
  const { isHost } = getPrivate();
  const { players } = getShared();
  const newState = {
    players: players.push(player),
  };

  setShared({ players: players.push(player) });

  if (isHost) broadcastData(newState);
};

initSync();
