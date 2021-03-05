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
    const conn = s.playerConnectionMap.get(authorizedPlayer.id);
    if (conn) conn.lastPing = new Date();
  });

  return respond();
};

export default handlePing;
