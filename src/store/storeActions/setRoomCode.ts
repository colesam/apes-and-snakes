import { setPrivate } from "../privateStore";
import { setShared } from "../sharedStore";

export const setRoomCode = (roomCode: string) => {
  setShared({ roomCode });
  setPrivate({ previousRoomCode: roomCode });
};
