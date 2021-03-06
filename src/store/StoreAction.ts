import { assignPairsToStocks } from "./storeActions/assignPairsToStocks";
import { closePosition } from "./storeActions/closePosition";
import { hostGame } from "./storeActions/hostGame";
import { incrementTick } from "./storeActions/incrementTick";
import { openPosition } from "./storeActions/openPosition";
import { pushRollModifiers } from "./storeActions/pushRollModifiers";
import { pushVolatilityModifiers } from "./storeActions/pushVolatilityModifiers";
import { runTicks } from "./storeActions/runTicks";
import { runWeekStart } from "./storeActions/runWeekStart";
import { setPlayerState } from "./storeActions/setPlayerState";
import { setRoomCode } from "./storeActions/setRoomCode";
import { setupGame } from "./storeActions/setupGame";

export const StoreAction = {
  openPosition,
  closePosition,
  runWeekStart,
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
