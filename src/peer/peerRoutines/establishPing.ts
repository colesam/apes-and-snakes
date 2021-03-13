import { PING_INTERVAL } from "../../config";
import { getStore, setStore } from "../../store/store";
import { logPing } from "../../util/log";
import { PeerAction } from "../PeerAction";

export const establishPing = (hostPeerId: string) => {
  const { secretKey, playerId } = getStore();

  const pingIntervalId = setInterval(() => {
    const start = new Date().getTime();
    PeerAction.ping(hostPeerId, secretKey, playerId).then(() => {
      const ping = new Date().getTime() - start;
      logPing(`Ping is ${ping}ms`);
      setStore(s => {
        s.ping = ping;
      });
    });
  }, PING_INTERVAL);

  setStore(s => {
    s.pingIntervalId = pingIntervalId;
  });
};
