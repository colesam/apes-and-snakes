import { StoreAction } from "../StoreAction";
import { setStore } from "../store";

export const hostGame = (roomCode: string, resetPlayerKeys = true) => {
  setStore({
    isHost: true,
    ...(resetPlayerKeys && { secretKeyPlayerIdMap: new Map() }),
  });
  StoreAction.setRoomCode(roomCode);
};
