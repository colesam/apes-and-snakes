import { setStore } from "../store";

export const setRoomCode = (roomCode: string) => {
  setStore({ roomCode, previousRoomCode: roomCode });
};
