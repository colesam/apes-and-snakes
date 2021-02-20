import { authPlayerAction } from "./storeActions/authPlayerAction";
import { hostGame } from "./storeActions/hostGame";
import { mapSecretKeyToPlayerId } from "./storeActions/mapSecretKeyToPlayerId";
import { pushPlayer } from "./storeActions/pushPlayer";
import { resetStores } from "./storeActions/resetStores";
import { setHostPeerId } from "./storeActions/setHostPeerId";
import { setPlayerConnection } from "./storeActions/setPlayerConnection";
import { setPlayerState } from "./storeActions/setPlayerState";
import { setRoomCode } from "./storeActions/setRoomCode";

export const StoreAction = {
  authPlayerAction,
  hostGame,
  mapSecretKeyToPlayerId,
  pushPlayer,
  resetStores,
  setHostPeerId,
  setPlayerConnection,
  setPlayerState,
  setRoomCode,
};
