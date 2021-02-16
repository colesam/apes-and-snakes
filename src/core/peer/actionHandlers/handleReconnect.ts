import { StoreAction } from "../../store/StoreAction";
import { TActionHandlerProps } from "../handleAction";
import { getPrivate } from "../../store/privateStore";
import GeneralError from "../../error/GeneralError";

export const makeHandleReconnect = (
  _getPrivate: typeof getPrivate,
  _StoreAction: typeof StoreAction
) => ({ peerId, payload, respond, error }: TActionHandlerProps) => {
  const { secretKeyPlayerIdMap } = _getPrivate();

  const playerId = secretKeyPlayerIdMap.get(payload.secretKey);

  if (!playerId) {
    return error(
      new GeneralError("Could not find playerId. Failed to reconnect.")
    );
  }

  _StoreAction.setPlayerConnection(playerId, { peerId });

  return respond();
};

const handleReconnect = makeHandleReconnect(getPrivate, StoreAction);

export default handleReconnect;
