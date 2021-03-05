import { ConnectionStatus } from "../../core/player/ConnectionStatus";
import { PlayerConnection } from "../../core/player/PlayerConnection";
import { StoreAction } from "../../store/StoreAction";
import { StoreSelector } from "../../store/StoreSelector";
import { getStore, setStore } from "../../store/store";
import NotAuthorizedError from "../error/NotAuthorizedError";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleReconnect = (
  _getStore: typeof getStore,
  _setStore: typeof setStore
) => ({ peerId, payload, respond, error }: TActionHandlerProps) => {
  const authorizedPlayer = StoreSelector.getAuthorizedPlayer(payload.secretKey)(
    _getStore()
  );

  if (!authorizedPlayer) {
    return error(new NotAuthorizedError());
  }

  _setStore(s => {
    const conn = s.playerConnectionMap.get(authorizedPlayer.id);

    if (conn) {
      conn.peerId = peerId;
      conn.lastPing = new Date();
    } else {
      s.playerConnectionMap.set(
        authorizedPlayer.id,
        new PlayerConnection({
          playerId: authorizedPlayer.id,
          lastPing: new Date(),
          peerId,
        })
      );
    }

    StoreAction.setPlayerState(authorizedPlayer.id, {
      connectionStatus: ConnectionStatus.CONNECTED,
    })(s);
  });

  return respond({ playerId: authorizedPlayer.id });
};

const handleReconnect = makeHandleReconnect(getStore, setStore);

export default handleReconnect;
