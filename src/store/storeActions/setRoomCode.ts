import { TStore } from "../store";

export const setRoomCode = (roomCode: string) => (s: TStore) => {
  s.roomCode = roomCode;
  s.previousRoomCode = roomCode;
};
