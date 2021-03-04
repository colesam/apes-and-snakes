import { produce } from "immer";
import { isFunction } from "lodash";
import create, { State } from "zustand";
import { devtools } from "zustand/middleware";
import { NUM_STOCKS } from "../config";
import { Deck } from "../core/card/Deck";
import { Flop } from "../core/card/Flop";
import { FlopPreview } from "../core/card/FlopPreview";
import { GuaranteedMap } from "../core/common/GuaranteedMap";
import { GameStatus } from "../core/game/GameStatus";
import generateId from "../core/generateId";
import { diff } from "../core/helpers";
import initStorage from "../core/localStorage";
import { Player } from "../core/player/Player";
import { PlayerConnection } from "../core/player/PlayerConnection";
import { RollModifier } from "../core/stock/RollModifier";
import { Stock } from "../core/stock/Stock";
import { VolatilityModifier } from "../core/stock/VolatilityModifier";
import { PeerAction } from "../peer/PeerAction";
import { StoreSelector } from "./StoreSelector";
import { stocks } from "./mockData/stocks";

const [storageGet, storageSet] = initStorage("sessionStorage", "store");

export interface TStore extends State {
  // Shared state
  tick: number;
  roomCode: string;
  gameStatus: GameStatus;
  players: Player[];
  flopDisplay: Flop | FlopPreview | null;

  // Stock state
  stocks: Stock[];
  stockRollModifierMap: GuaranteedMap<string, RollModifier[]>;
  stockVolatilityModifierMap: GuaranteedMap<string, VolatilityModifier[]>;

  // Host state
  isHost: boolean;
  secretKeyPlayerIdMap: Map<string, string>;
  playerConnectionMap: Map<string, PlayerConnection>;
  deck: Deck;
  flop: Flop | null;

  // Player state
  ping: number | null;
  hostPeerId: string;
  previousRoomCode: string;
  playerId: string;
  pingIntervalId: NodeJS.Timeout | null;
  secretKey: string;
}
export type TStoreKey = keyof TStore;
export type TStoreEntries = [TStoreKey, TStore[TStoreKey]][];

export const initialState: TStore = {
  // Shared state
  tick: 0,
  roomCode: "",
  gameStatus: GameStatus.LOBBY,
  players: [],
  flopDisplay: null,

  // Stock state
  stocks: stocks.slice(0, NUM_STOCKS),
  stockRollModifierMap: new GuaranteedMap<string, RollModifier[]>(() => []),
  stockVolatilityModifierMap: new GuaranteedMap<string, VolatilityModifier[]>(
    () => []
  ),

  // Host state
  isHost: false,
  secretKeyPlayerIdMap: new Map(),
  playerConnectionMap: new Map(),
  deck: new Deck().shuffle(),
  flop: null,

  // Player state
  ping: null,
  hostPeerId: "",
  previousRoomCode: "",
  playerId: "",
  pingIntervalId: null,
  secretKey: generateId(),
};

// Create store
export const useStore = create<TStore>(
  devtools(() => initialState, "Zustand Store")
);

// State configuration
interface TStateConfig {
  peerSync: boolean;
  storeLocally: boolean;
}
const defaultConfig: TStateConfig = { peerSync: false, storeLocally: false };
const stateConfig: { [key in TStoreKey]: Partial<TStateConfig> } = {
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
  playerConnectionMap: {},
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
export const getStateConfig = (key: TStoreKey): TStateConfig => ({
  ...defaultConfig,
  ...(stateConfig[key] || {}),
});

// Helper exports
export const getStore = useStore.getState;
export const setStore = (update: Partial<TStore> | ((s: TStore) => void)) => {
  if (isFunction(update)) {
    useStore.setState(s => produce(s, update));
  } else {
    useStore.setState(update);
  }
};
export const resetStore = () => setStore(initialState);

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

// TODO: Once I have a solid pattern for the store worked out, begin splitting store.ts into multiple files
