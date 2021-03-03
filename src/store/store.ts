import { produce } from "immer";
import { isFunction } from "lodash";
import create, { State } from "zustand";
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

  stockRollModifierMap: Map<string, RollModifier[]>;
  setStockRollModifierMap: (k: string, v: RollModifier[]) => void;

  stockVolatilityModifierMap: Map<string, VolatilityModifier[]>;
  setStockVolatilityModifierMap: (k: string, v: VolatilityModifier[]) => void;

  // Host state

  isHost: boolean;

  secretKeyPlayerIdMap: Map<string, string>;
  setSecretKeyPlayerIdMap: (k: string, v: string) => void;

  playerConnectionMap: Map<string, PlayerConnection>;
  setPlayerConnectionMap: (k: string, v: PlayerConnection) => void;

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

// Generalized producers
const setMap = <T, K>(k: T, v: K) => produce(draft => draft.set(k, v));

// Create store
export const useStore = create<TStore>(
  devtools(
    set =>
      ({
        // Shared state

        tick: 0,
        roomCode: "",
        gameStatus: GameStatus.LOBBY,
        players: [],
        flopDisplay: null,

        // Stock state

        stocks: stocks.slice(0, NUM_STOCKS),

        stockRollModifierMap: new Map(),
        setStockRollModifierMap: (ticker, rollMods) =>
          set(s => setMap(ticker, rollMods)(s.stockRollModifierMap)),

        stockVolatilityModifierMap: new Map(),
        setStockVolatilityModifierMap: (ticker, volMods) =>
          set(s => setMap(ticker, volMods)(s.stockVolatilityModifierMap)),

        // Host state

        isHost: false,

        secretKeyPlayerIdMap: new Map(),
        setSecretKeyPlayerIdMap: (secretKey, playerId) =>
          set(s => setMap(secretKey, playerId)(s.secretKeyPlayerIdMap)),

        playerConnectionMap: new Map(),
        setPlayerConnectionMap: (playerId, conn) =>
          set(s => setMap(playerId, conn)(s.playerConnectionMap)),

        deck: new Deck().shuffle(),
        flop: null as Flop | null,

        // Player state

        ping: null as number | null,
        hostPeerId: "",
        previousRoomCode: "",
        playerId: "",
        pingIntervalId: null as NodeJS.Timeout | null,
        secretKey: generateId(),
      } as TStore),
    "Zustand Store"
  )
);

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
