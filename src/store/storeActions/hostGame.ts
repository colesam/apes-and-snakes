import { StoreAction } from "../StoreAction";
import { TStore } from "../store";

export const hostGame = (roomCode: string, resetPlayerKeys = true) => (
  s: TStore
) => {
  s.isHost = true;
  StoreAction.setRoomCode(roomCode)(s);

  if (resetPlayerKeys) {
    s.secretKeyPlayerIdMap = new Map();
  }
};
