import { setStore } from "../store";

export const incrementTick = () => {
  setStore(s => ({ tick: s.tick + 1 }));
};
