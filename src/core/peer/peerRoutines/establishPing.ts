import { PeerAction } from "../PeerAction";
import { getPrivate, setPrivate } from "../../store/privateStore";
import { pingInterval } from "../../../config";

export const establishPing = (hostPeerId: string) => {
  const { secretKey, playerId } = getPrivate();

  const pingIntervalId = setInterval(() => {
    PeerAction.ping(hostPeerId, secretKey, playerId);
  }, pingInterval);

  setPrivate({ pingIntervalId });
};
