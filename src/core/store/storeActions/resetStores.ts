import { resetPrivateStore } from "../privateStore";
import { resetSharedStore } from "../sharedStore";

export const resetStores = () => {
  resetSharedStore();
  resetPrivateStore();
};
