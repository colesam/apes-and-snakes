import { pingInterval } from "../../../config";
import { getPrivate, setPrivate } from "../../store/privateStore";
import { PeerAction } from "../PeerAction";

export const establishPing = (hostPeerId: string) => {
  const { secretKey, playerId } = getPrivate();

  const pingIntervalId = setInterval(() => {
    PeerAction.ping(hostPeerId, secretKey, playerId);
  }, pingInterval);

  setPrivate({ pingIntervalId });
};
