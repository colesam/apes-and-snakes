import { StoreAction } from "../../store/StoreAction";
import NotAuthorizedError from "../error/NotAuthorizedError";
import { TActionHandlerProps } from "../handleAction";

const handlePing = ({
  peerId,
  payload,
  respond,
  error,
}: TActionHandlerProps) => {
  console.log(`[DEBUG] Received PING from: ${peerId}`);

  // TODO: Turn this into a middleware
  if (!StoreAction.authPlayerAction(payload.secretKey, payload.playerId)) {
    return error(new NotAuthorizedError(payload.playerId));
  }

  StoreAction.setPlayerConnection(payload.playerId, {
    lastPing: new Date(),
  });

  return respond();
};

export default handlePing;