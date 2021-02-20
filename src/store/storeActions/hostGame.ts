import { StoreAction } from "../StoreAction";
import { setPrivate } from "../privateStore";

export const hostGame = (roomCode: string, resetPlayerKeys = true) => {
  setPrivate({
    isHost: true,
    ...(resetPlayerKeys && { secretKeyPlayerIdMap: {} }),
  });
  StoreAction.setRoomCode(roomCode);
};
