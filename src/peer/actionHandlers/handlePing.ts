import { StoreAction } from "../../store/StoreAction";
import { getStore, Selector } from "../../store/store";
import NotAuthorizedError from "../error/NotAuthorizedError";
import { TActionHandlerProps } from "../handleAction";

const handlePing = ({ payload, respond, error }: TActionHandlerProps) => {
  const authorizedPlayer = Selector.getAuthorizedPlayer(getStore())(
    payload.secretKey
  );

  if (!authorizedPlayer) {
    return error(new NotAuthorizedError());
  }

  StoreAction.setPlayerConnection(authorizedPlayer.id, {
    lastPing: new Date(),
  });

  return respond();
};

export default handlePing;
