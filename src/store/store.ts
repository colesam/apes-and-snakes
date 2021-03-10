import { produce } from "immer";
import { cloneDeep, isFunction } from "lodash";
import create, { State } from "zustand";
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
import { logDebug } from "../util/log";
import { StoreSelector } from "./StoreSelector";
import { devtools } from "./middleware/devtools";
import { stocks } from "./mockData/stocks";

const [storageGet, storageSet] = initStorage("sessionStorage", "store");

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
}
export type TStoreKey = keyof TStore;
export type TStoreEntries = [TStoreKey, TStore[TStoreKey]][];

export const initialState = () =>
  cloneDeep({
    // Shared state
    tick: 0,
    roomCode: "",
    gameStatus: GameStatus.LOBBY,
    players: [],

    // Stock state
    stocks: stocks.slice(0, NUM_STOCKS),
    stockRollModifierMap: new Map(),
    stockVolatilityModifierMap: new Map(),

    // Flop state
    flop: new Flop(),
    flopSetAt: 0,
    retiredCard: new Card(),

    // Host state
    isHost: false,
    secretKeyPlayerIdMap: new Map(),
    playerConnectionMap: new Map(),
    deck: new Deck().shuffle(),

    // Player state
    ping: null,
    hostPeerId: "",
    previousRoomCode: "",
    playerId: "",
    pingIntervalId: null,
    secretKey: storageGet("secretKey") || storageSet("secretKey", generateId()),

    // Misc
    viewFullHistory: false,
  } as TStore);

// Create store
export const useStore = create<TStore>(devtools(initialState, "Zustand Store"));

// State configuration
interface TStateConfig {
  peerSync: boolean;
  storeLocally: boolean;
  storeLocallyIfHost: boolean;
}
const defaultConfig: TStateConfig = {
  peerSync: false,
  storeLocally: true,
  storeLocallyIfHost: true,
};
const stateConfig: { [key in TStoreKey]: Partial<TStateConfig> } = {
  // Shared state
  tick: { peerSync: true },
  roomCode: { peerSync: true },
  gameStatus: { peerSync: true, storeLocally: false, storeLocallyIfHost: true },
  players: { peerSync: true },
  stocks: { peerSync: true },

  // Flop state
  flop: { peerSync: true },
  flopSetAt: { peerSync: true },
  retiredCard: { peerSync: true },

  // Host state
  isHost: { storeLocally: true },
  secretKeyPlayerIdMap: {},
  playerConnectionMap: {},
  deck: {},
  stockRollModifierMap: {},
  stockVolatilityModifierMap: {},

  // Player state
  ping: {},
  hostPeerId: { storeLocally: true },
  previousRoomCode: { storeLocally: true },
  playerId: { storeLocally: true },
  pingIntervalId: {},
  secretKey: { storeLocally: true },

  // Misc
  viewFullHistory: {},
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
const setStoreFromStorage = () => {
  logDebug("Loading store state from local storage");
  const initialStorageState: any = {};
  for (const key in initialState) {
    const val = storageGet(key);
    if (val != null) {
      initialStorageState[key] = val;
    }
  }
  setStore(initialStorageState);
};

setStoreFromStorage();

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
