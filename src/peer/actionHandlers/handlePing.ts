import { StoreSelector } from "../../store/StoreSelector";
import { getStore, setStore } from "../../store/store";
import NotAuthorizedError from "../error/NotAuthorizedError";
import { TActionHandlerProps } from "../handleAction";

const handlePing = ({ payload, respond, error }: TActionHandlerProps) => {
  const authorizedPlayer = StoreSelector.getAuthorizedPlayer(payload.secretKey)(
    getStore()
  );

  if (!authorizedPlayer) {
    return error(new NotAuthorizedError());
  }

  setStore(s => {
    s.playerConnectionMap.get(authorizedPlayer.id)!.lastPing = new Date();
  });

  return respond();
};

export default handlePing;
