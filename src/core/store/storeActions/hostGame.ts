import { setPrivate } from "../privateStore";
import { Map } from "immutable";
import { StoreAction } from "../StoreAction";

export const hostGame = (roomCode: string, resetPlayerKeys = true) => {
  setPrivate({
    isHost: true,
    ...(resetPlayerKeys && { secretKeyPlayerIdMap: Map<string, string>() }),
  });
  StoreAction.setRoomCode(roomCode);
};
