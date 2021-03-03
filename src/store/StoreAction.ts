import { assignPairsToStocks } from "./storeActions/assignPairsToStocks";
import { hostGame } from "./storeActions/hostGame";
import { incrementTick } from "./storeActions/incrementTick";
import { mapSecretKeyToPlayerId } from "./storeActions/mapSecretKeyToPlayerId";
import { pushPlayer } from "./storeActions/pushPlayer";
import { pushRollModifiers } from "./storeActions/pushRollModifiers";
import { pushVolatilityModifiers } from "./storeActions/pushVolatilityModifiers";
import { runTicks } from "./storeActions/runTicks";
import { setHostPeerId } from "./storeActions/setHostPeerId";
import { setPlayerConnection } from "./storeActions/setPlayerConnection";
import { setPlayerState } from "./storeActions/setPlayerState";
import { setRoomCode } from "./storeActions/setRoomCode";
import { setupGame } from "./storeActions/setupGame";

export const StoreAction = {
  assignPairsToStocks,
  hostGame,
  incrementTick,
  mapSecretKeyToPlayerId,
  pushPlayer,
  pushRollModifiers,
  pushVolatilityModifiers,
  runTicks,
  setHostPeerId,
  setPlayerConnection,
  setPlayerState,
  setRoomCode,
  setupGame,
};
