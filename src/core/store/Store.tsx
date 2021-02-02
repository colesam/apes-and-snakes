import create from "zustand";
import { devtools } from "zustand/middleware";
import Player from "./types/Player";
import { List } from "immutable";
import { broadcastData, initSync } from "./PeerDataSync";

export type StoreType = {
  isHost: boolean;
  host: (roomCode: string) => void;

  roomCode: string;
  setRoomCode: (roomCode: string) => void;

  players: List<Player>;
  pushPlayer: (player: Player) => void;
};

export const store = create<StoreType>(
  devtools((set, get) => ({
    isHost: false,
    host: (roomCode) => set(() => ({ roomCode, isHost: true })),

    roomCode: "",
    setRoomCode: (roomCode) => set({ roomCode }),

    players: List<Player>(),
    pushPlayer: (player) => {
      const newState = {
        players: get().players.push(player),
      };

      set(newState);

      if (get().isHost) broadcastData(newState);
    },
  }))
);

// Hook version of store object
export const useStore = store;

initSync(store);
