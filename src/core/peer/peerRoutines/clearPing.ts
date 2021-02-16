import { getPrivate, setPrivate } from "../../store/privateStore";

export const clearPing = () => {
  const { pingIntervalId } = getPrivate();
  if (pingIntervalId) {
    clearInterval(pingIntervalId);
    setPrivate({ pingIntervalId: null });
  }
};
