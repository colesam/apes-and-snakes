import generateId from "../core/generateId";
import initStorage from "../core/localStorage";
import { PlayerConnection } from "../core/player/PlayerConnection";
import { RollModifier } from "../core/stock/RollModifier";
import { VolitilityModifier } from "../core/stock/VolitilityModifier";

const [storageGet, storageSet] = initStorage("sessionStorage", "privateStore");

export const privateState = {
  // Host state
  isHost: false,
  secretKeyPlayerIdMap: {} as { [key: string]: string },
  playerConnections: {} as { [key: string]: PlayerConnection },
  stockRollModifierMap: {} as { [key: string]: RollModifier[] },
  stockVolatilityModifierMap: {} as { [key: string]: VolitilityModifier[] },

  // Player state
  hostPeerId: "",
  previousRoomCode: "",
  playerId: "",
  pingIntervalId: null as NodeJS.Timeout | null,
  secretKey:
    storageGet("secretKey") ||
    (storageSet("secretKey", generateId()) as string),
};