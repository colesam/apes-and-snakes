import { getStore, setStore } from "../../store/store";

export const clearPing = () => {
  const { pingIntervalId } = getStore();
  if (pingIntervalId) {
    clearInterval(pingIntervalId);
    setStore(s => {
      s.pingIntervalId = null;
    });
  }
};
