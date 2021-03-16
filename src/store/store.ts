import { applyPatches, Patch, produce } from "immer";
import { cloneDeep, isFunction } from "lodash";
import create, { State, UseStore } from "zustand";
import { NUM_STOCKS } from "../config";
import { Card } from "../core/card/Card";
import { Deck } from "../core/card/Deck";
import { Flop } from "../core/card/Flop";
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
import { logDebug, logTime } from "../util/log";
import { StoreSelector } from "./StoreSelector";
import { devtools } from "./middleware/devtools";
import { stocks } from "./mockData/stocks";

const [storageGet, storageSet, storageClear] = initStorage(
  "sessionStorage",
  "store"
);

export interface TStore extends State {
  // Shared state
  tick: number;
  roomCode: string;
  gameStatus: GameStatus;
  players: Player[];

  // Stock state
  stocks: Stock[];
  stockRollModifierMap: Map<string, RollModifier[]>;
  stockVolatilityModifierMap: Map<string, VolatilityModifier[]>;

  // Flop state
  flop: Flop;
  flopSetAt: number;
  retiredCard: Card;

  // Host state
  isHost: boolean;
  secretKeyPlayerIdMap: Map<string, string>;
  playerConnectionMap: Map<string, PlayerConnection>;
  deck: Deck;

  // Player state
  ping: number | null;
  hostPeerId: string;
  previousRoomCode: string;
  playerId: string;
  pingIntervalId: NodeJS.Timeout | null;
  secretKey: string;

  // Misc
  viewFullHistory: boolean;
  sortStocks: boolean;
  highlightCards: Card[];
}
export type TStoreKey = keyof TStore;
export type TStoreEntries = [TStoreKey, TStore[TStoreKey]][];

const stateConfig = {
  // Shared state
  tick: { init: () => 0, peerSync: true },
  roomCode: { init: () => "", peerSync: true },
  gameStatus: { init: () => GameStatus.LOBBY, peerSync: true },
  players: { init: () => [], peerSync: true },

  // Stock state
  stocks: {
    init: () => cloneDeep(stocks.slice(0, NUM_STOCKS)),
    peerSync: true,
  },
  stockRollModifierMap: { init: () => new Map() },
  stockVolatilityModifierMap: { init: () => new Map() },

  // Flop state
  flop: { init: () => new Flop(), peerSync: true },
  flopSetAt: { init: () => 0, peerSync: true },
  retiredCard: { init: () => new Card(), peerSync: true },

  // Host state
  isHost: { init: () => false },
  secretKeyPlayerIdMap: { init: () => new Map() },
  playerConnectionMap: { init: () => new Map() },
  deck: { init: () => new Deck().shuffle() },

  // Player state
  ping: { init: () => null },
  hostPeerId: { init: () => "" },
  previousRoomCode: { init: () => "" },
  playerId: { init: () => "" },
  pingIntervalId: { init: () => null },
  secretKey: {
    init: () =>
      storageGet("secretKey") || storageSet("secretKey", generateId()),
  },

  // Misc
  viewFullHistory: { init: () => false },
  sortStocks: { init: () => false },
  highlightCards: {
    init: () => [],
    storeLocally: false,
    storeLocallyIfHost: false,
  },
} as { [key in TStoreKey]: TStateConfig };

// State configuration
export interface TStateConfig {
  init: any;
  peerSync?: boolean;
  storeLocally?: boolean;
  storeLocallyIfHost?: boolean;
}

const defaultConfig: Partial<TStateConfig> = {
  peerSync: false,
  storeLocally: true,
  storeLocallyIfHost: true,
};

export const getStateConfig = (key: TStoreKey): TStateConfig => ({
  ...defaultConfig,
  ...(stateConfig[key] || {}),
});

export const initialState = () => {
  const res = {} as TStore;
  for (const key in stateConfig) {
    res[key] = stateConfig[key].init();
  }
  return res;
};

// Initialize state from local storage
const setStoreFromStorage = (store: UseStore<TStore>) => {
  logDebug("Loading store state from local storage.");
  const initialStorageState: any = {};
  for (const key in stateConfig) {
    const val = storageGet(key);
    if (val != null) {
      initialStorageState[key] = val;
    }
  }
  store.setState(initialStorageState);
};

// Create store if it doesn't exist
if (window.__ZustandStore__) {
  // This helps load any changes to classes that are stored in the store
  setStoreFromStorage(window.__ZustandStore__);
} else {
  logDebug("Creating new store.");
  window.__ZustandStore__ = create<TStore>(
    devtools(initialState, "Zustand Store")
  );
}

// Main exports
export const useStore = window.__ZustandStore__;

export const getStore = useStore.getState;

export const setStore = (update: Partial<TStore> | ((s: TStore) => void)) => {
  logTime(
    "setStore()",
    () => {
      if (isFunction(update)) {
        useStore.setState(s => {
          if (s.isHost) {
            return produce(s, update, patches => {
              peerSyncPatches(s.tick, patches);
            });
          } else {
            return produce(s, update);
          }
        });
      } else {
        const { isHost } = getStore();
        useStore.setState(update);
        if (isHost) {
          peerSyncState(update);
        }
      }
    },
    150
  );
};

export const resetStore = (clearStorage = false) => {
  if (clearStorage) {
    storageClear();
  }
  setStore(initialState);
};

export const applyPatchesToStore = (patches: Patch[]) => {
  setStore(applyPatches(getStore(), patches));
};

// Helper methods
const peerSyncState = (stateChanges: Partial<TStore>) => {
  const peerSyncedChanges = StoreSelector.syncedState(stateChanges);
  if (Object.keys(peerSyncedChanges).length) {
    PeerAction.broadcastState(peerSyncedChanges);
  }
};

const peerSyncPatches = (tick: number, patches: Patch[]) => {
  const peerSyncedPatches = patches.filter(
    patch => getStateConfig(patch.path[0]).peerSync
  );
  if (peerSyncedPatches.length) {
    PeerAction.broadcastPatches({ tick, patches: peerSyncedPatches });
  }
};

// Set up local storage persistance
useStore.subscribe((newState, oldState) => {
  const stateChanges = diff(newState, oldState);
  for (const [key, value] of Object.entries(stateChanges)) {
    // @ts-ignore
    const { storeLocally, storeLocallyIfHost } = getStateConfig(key);
    if (storeLocally || (oldState.isHost && storeLocallyIfHost)) {
      storageSet(key, value);
    }
  }
});

// TODO: Once I have a solid pattern for the store worked out, begin splitting store.ts into multiple files
