import PeerError from "../error/PeerError";
import { StoreAction } from "../../store/StoreAction";
import { getPrivate } from "../../store/privateStore";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleReconnect = (
  _getPrivate: typeof getPrivate,
  _StoreAction: typeof StoreAction
) => ({ peerId, payload, respond, error }: TActionHandlerProps) => {
  const { secretKeyPlayerIdMap } = _getPrivate();

  const playerId = secretKeyPlayerIdMap.get(payload.secretKey);

  if (!playerId) {
    return error(
      new PeerError("Could not find playerId. Failed to reconnect.")
    );
  }

  _StoreAction.setPlayerConnection(playerId, { peerId });

  return respond();
};

const handleReconnect = makeHandleReconnect(getPrivate, StoreAction);

export default handleReconnect;
