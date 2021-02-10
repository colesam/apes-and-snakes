import storeActions from "../../store/storeActions";
import { TActionHandlerProps } from "../handleAction";
import { getPrivate } from "../../store/privateStore";

const handleReconnect = ({ peerId, payload, respond }: TActionHandlerProps) => {
  const { secretKeyPlayerIdMap } = getPrivate();

  const playerId = secretKeyPlayerIdMap.get(payload.secretKey);

  if (!playerId) {
    throw new Error("Could not find playerId. Failed to reconnect.");
  }

  storeActions.setPlayerConnection(playerId, { peerId });

  return respond();
};

export default handleReconnect;
