import { PING_INTERVAL } from "../../config";
import { getStore, setStore } from "../../store/store";
import { logDebug } from "../../util/log";
import { PeerAction } from "../PeerAction";

export const establishPing = (hostPeerId: string) => {
  const { secretKey, playerId } = getStore();

  const pingIntervalId = setInterval(() => {
    const start = new Date().getTime();
    PeerAction.ping(hostPeerId, secretKey, playerId).then(() => {
      const ping = new Date().getTime() - start;
      logDebug(`Ping is ${ping}ms`);
      setStore({ ping });
    });
  }, PING_INTERVAL);

  setStore({ pingIntervalId });
};
