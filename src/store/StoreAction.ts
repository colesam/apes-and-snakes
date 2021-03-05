import { assignPairsToStocks } from "./storeActions/assignPairsToStocks";
import { closePosition } from "./storeActions/closePosition";
import { hostGame } from "./storeActions/hostGame";
import { incrementTick } from "./storeActions/incrementTick";
import { openPosition } from "./storeActions/openPosition";
import { pushRollModifiers } from "./storeActions/pushRollModifiers";
import { pushVolatilityModifiers } from "./storeActions/pushVolatilityModifiers";
import { runFlop } from "./storeActions/runFlop";
import { runFlopPreview } from "./storeActions/runFlopPreview";
import { runTicks } from "./storeActions/runTicks";
import { runWeekReset } from "./storeActions/runWeekReset";
import { setPlayerState } from "./storeActions/setPlayerState";
import { setRoomCode } from "./storeActions/setRoomCode";
import { setupGame } from "./storeActions/setupGame";

export const StoreAction = {
  openPosition,
  closePosition,
  runWeekReset,
  runFlop,
  runFlopPreview,
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
