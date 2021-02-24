import { setShared } from "../sharedStore";

export const incrementTick = () => {
  setShared(s => ({ tick: s.tick + 1 }));
};
