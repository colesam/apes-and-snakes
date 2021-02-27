import { Deck } from "../core/card/Deck";
import { Flop } from "../core/card/Flop";
import generateId from "../core/generateId";
import initStorage from "../core/localStorage";
import { PlayerConnection } from "../core/player/PlayerConnection";
import { RollModifier } from "../core/stock/RollModifier";
import { VolatilityModifier } from "../core/stock/VolatilityModifier";
import { TMap } from "./types/TMap";

const [storageGet, storageSet] = initStorage("sessionStorage", "privateStore");

export const privateState = {
  // Host state
  isHost: false,
  secretKeyPlayerIdMap: {} as TMap<string>,
  playerConnections: {} as TMap<PlayerConnection>,
  deck: new Deck().shuffle(),
  flop: null as Flop | null,
  stockRollModifierMap: {} as TMap<RollModifier[]>,
  stockVolatilityModifierMap: {} as TMap<VolatilityModifier[]>,

  // Player state
  hostPeerId: "",
  previousRoomCode: "",
  playerId: "",
  pingIntervalId: null as NodeJS.Timeout | null,
  secretKey:
    storageGet("secretKey") ||
    (storageSet("secretKey", generateId()) as string),
};
