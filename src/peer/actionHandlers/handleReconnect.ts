import { ConnectionStatus } from "../../core/player/ConnectionStatus";
import { StoreAction } from "../../store/StoreAction";
import { getPrivate } from "../../store/privateStore";
import PeerError from "../error/PeerError";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleReconnect = (
  _getPrivate: typeof getPrivate,
  _StoreAction: typeof StoreAction
) => ({ peerId, payload, respond, error }: TActionHandlerProps) => {
  const { secretKeyPlayerIdMap } = _getPrivate();
  const playerId = secretKeyPlayerIdMap[payload.secretKey];

  if (!playerId) {
    return error(
      new PeerError("Could not find playerId. Failed to reconnect.")
    );
  }

  _StoreAction.setPlayerConnection(playerId, {
    peerId,
    lastPing: new Date(),
  });

  _StoreAction.setPlayerState(playerId, {
    connectionStatus: ConnectionStatus.CONNECTED,
  });

  return respond({ playerId });
};

const handleReconnect = makeHandleReconnect(getPrivate, StoreAction);

export default handleReconnect;
