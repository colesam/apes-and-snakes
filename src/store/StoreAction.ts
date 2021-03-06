import { assignPairsToStocks } from "./storeActions/assignPairsToStocks";
import { closePosition } from "./storeActions/closePosition";
import { hostGame } from "./storeActions/hostGame";
import { incrementTick } from "./storeActions/incrementTick";
import { openPosition } from "./storeActions/openPosition";
import { pushRollModifiers } from "./storeActions/pushRollModifiers";
import { pushVolatilityModifiers } from "./storeActions/pushVolatilityModifiers";
import { runTicks } from "./storeActions/runTicks";
import { setPlayerState } from "./storeActions/setPlayerState";
import { setRoomCode } from "./storeActions/setRoomCode";
import { setupGame } from "./storeActions/setupGame";
import { shiftFlop } from "./storeActions/shiftFlop";

export const StoreAction = {
  shiftFlop,
  openPosition,
  closePosition,
  assignPairsToStocks,
  hostGame,
  incrementTick,
  pushRollModifiers,
  pushVolatilityModifiers,
  runTicks,
  setPlayerState,
  setRoomCode,
  setupGame,
};
