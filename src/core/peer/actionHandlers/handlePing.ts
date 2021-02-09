import storeActions from "../../store/storeActions";
import { TActionHandlerProps } from "../handleAction";
import NotAuthorizedError from "../../error/NotAuthorizedError";
import { ConnectionStatus } from "../../store/types/PlayerConnection";

const handlePing = ({
  peerId,
  payload,
  respond,
  error,
}: TActionHandlerProps) => {
  console.log(`[DEBUG] Received PING from: ${peerId}`);

  // TODO: Turn this into a middleware
  if (!storeActions.authPlayerAction(payload.secretKey, payload.playerId)) {
    return error(new NotAuthorizedError(payload.playerId));
  }

  storeActions.setPlayerConnection(payload.playerId, {
    lastPing: new Date(),
    connectionStatus: ConnectionStatus.CONNECTED,
  });

  return respond();
};

export default handlePing;
