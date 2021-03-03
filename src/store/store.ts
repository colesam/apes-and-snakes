import { isFunction } from "lodash";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { NUM_STOCKS } from "../config";
import { Deck } from "../core/card/Deck";
import { Flop } from "../core/card/Flop";
import { FlopPreview } from "../core/card/FlopPreview";
import { GameStatus } from "../core/game/GameStatus";
import generateId from "../core/generateId";
import { diff } from "../core/helpers";
import initStorage from "../core/localStorage";
import { Player } from "../core/player/Player";
import { PlayerConnection } from "../core/player/PlayerConnection";
import { RollModifier } from "../core/stock/RollModifier";
import { VolatilityModifier } from "../core/stock/VolatilityModifier";
import { PeerAction } from "../peer/PeerAction";
import { StoreSelector } from "./StoreSelector";
import { stocks } from "./mockData/stocks";
import { TMap } from "./types/TMap";

const [storageGet, storageSet] = initStorage("sessionStorage", "store");

export const initialState = {
  // Shared state
  tick: 0,
  roomCode: "",
  gameStatus: GameStatus.LOBBY,
  players: [] as Player[],
  stocks: stocks.slice(0, NUM_STOCKS),
  flopDisplay: null as Flop | FlopPreview | null,

  // Host state
  isHost: false,
  secretKeyPlayerIdMap: {} as TMap<string>,
  playerConnections: {} as TMap<PlayerConnection>,
  deck: new Deck().shuffle(),
  flop: null as Flop | null,
  stockRollModifierMap: {} as TMap<RollModifier[]>,
  stockVolatilityModifierMap: {} as TMap<VolatilityModifier[]>,

  // Player state
  ping: null as number | null,
  hostPeerId: "",
  previousRoomCode: "",
  playerId: "",
  pingIntervalId: null as NodeJS.Timeout | null,
  secretKey: generateId(),
};

const defaultConfig = { peerSync: false, storeLocally: false };
const stateConfig = {
  // Shared state
  tick: { peerSync: true },
  roomCode: { peerSync: true },
  gameStatus: { peerSync: true },
  players: { peerSync: true },
  stocks: { peerSync: true },
  flopDisplay: { peerSync: true },

  // Host state
  isHost: {},
  secretKeyPlayerIdMap: {},
  playerConnections: {},
  deck: {},
  flop: {},
  stockRollModifierMap: {},
  stockVolatilityModifierMap: {},

  // Player state
  ping: {},
  hostPeerId: {},
  previousRoomCode: { storeLocally: true },
  playerId: { storeLocally: true },
  pingIntervalId: {},
  secretKey: {},
};

export const getStateConfig = (key: TStoreKey) => ({
  ...defaultConfig,
  // @ts-ignore - see if this can be more strictly typed in the future
  ...(stateConfig[key] || {}),
});

export type TStore = typeof initialState;
export type TStoreKey = keyof TStore;

export const useStore = create<TStore>(
  // @ts-ignore See: https://github.com/microsoft/TypeScript/issues/19360
  devtools(() => initialState, "Zustand Store")
);

export const getStore = useStore.getState;
export const setStore = (
  update: Partial<TStore> | ((s: TStore) => Partial<TStore>)
) => {
  if (isFunction(update)) {
    useStore.setState(update(getStore()));
  } else {
    useStore.setState(update);
  }
};
export const resetStore = () => setStore(initialState);

// TODO: Refactor below into some sort of middleware
// Initialize state from local storage
const initialStorageState: any = {};
for (const key in initialState) {
  const val = storageGet(key);
  if (val != null) {
    initialStorageState[key] = val;
  }
}
setStore(initialStorageState);

// Set up local storage persistance
useStore.subscribe((newState, oldState) => {
  const stateChanges = diff(newState, oldState);
  for (const [key, value] of Object.entries(stateChanges)) {
    // @ts-ignore
    if (getStateConfig(key).storeLocally) {
      storageSet(key, value);
    }
  }
});

// Automatically emit changes to all peers, if hosting
useStore.subscribe((newState, oldState) => {
  if (oldState.isHost) {
    const stateChanges = diff(newState, oldState);
    const peerSyncedChanges = StoreSelector.syncedState(stateChanges);
    if (Object.keys(peerSyncedChanges).length) {
      PeerAction.broadcastShared(peerSyncedChanges);
    }
  }
});
