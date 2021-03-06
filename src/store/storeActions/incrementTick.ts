import { TStore } from "../store";

export const incrementTick = (s: TStore) => {
  s.tick += 1;
};
