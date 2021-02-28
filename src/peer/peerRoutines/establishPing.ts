import { PING_INTERVAL } from "../../config";
import { getPrivate, setPrivate } from "../../store/privateStore";
import { PeerAction } from "../PeerAction";

export const establishPing = (hostPeerId: string) => {
  const { secretKey, playerId } = getPrivate();

  const pingIntervalId = setInterval(() => {
    const start = new Date().getTime();
    PeerAction.ping(hostPeerId, secretKey, playerId).then(() => {
      const ping = new Date().getTime() - start;
      setPrivate({ ping });
    });
  }, PING_INTERVAL);

  setPrivate({ pingIntervalId });
};
