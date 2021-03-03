import { ConnectionStatus } from "../../core/player/ConnectionStatus";
import { StoreAction } from "../../store/StoreAction";
import { StoreSelector } from "../../store/StoreSelector";
import { getStore } from "../../store/store";
import NotAuthorizedError from "../error/NotAuthorizedError";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleReconnect = (
  _getStore: typeof getStore,
  _StoreAction: typeof StoreAction
) => ({ peerId, payload, respond, error }: TActionHandlerProps) => {
  const authorizedPlayer = StoreSelector.getAuthorizedPlayer(payload.secretKey)(
    _getStore()
  );

  if (!authorizedPlayer) {
    return error(new NotAuthorizedError());
  }

  _StoreAction.setPlayerConnection(authorizedPlayer.id, {
    peerId,
    lastPing: new Date(),
  });

  _StoreAction.setPlayerState(authorizedPlayer.id, {
    connectionStatus: ConnectionStatus.CONNECTED,
  });

  return respond({ playerId: authorizedPlayer.id });
};

const handleReconnect = makeHandleReconnect(getStore, StoreAction);

export default handleReconnect;
