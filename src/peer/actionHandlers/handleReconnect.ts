import { ConnectionStatus } from "../../core/player/ConnectionStatus";
import { StoreAction } from "../../store/StoreAction";
import { StoreSelector } from "../../store/StoreSelector";
import { getStore, setStore } from "../../store/store";
import NotAuthorizedError from "../error/NotAuthorizedError";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleReconnect = (
  _getStore: typeof getStore,
  _setStore: typeof setStore,
  _StoreAction: typeof StoreAction
) => ({ peerId, payload, respond, error }: TActionHandlerProps) => {
  const authorizedPlayer = StoreSelector.getAuthorizedPlayer(payload.secretKey)(
    _getStore()
  );

  if (!authorizedPlayer) {
    return error(new NotAuthorizedError());
  }

  _setStore(s => {
    const conn = s.playerConnectionMap.get(authorizedPlayer.id);
    conn.peerId = peerId;
    conn.lastPing = new Date();
  });

  _StoreAction.setPlayerState(authorizedPlayer.id, {
    connectionStatus: ConnectionStatus.CONNECTED,
  });

  return respond({ playerId: authorizedPlayer.id });
};

const handleReconnect = makeHandleReconnect(getStore, setStore, StoreAction);

export default handleReconnect;
