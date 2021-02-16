import storeActions from "../../store/storeActions";
import { TActionHandlerProps } from "../handleAction";
import { getPrivate } from "../../store/privateStore";
import GeneralError from "../../error/GeneralError";

export const makeHandleReconnect = (
  getPrivateMock: typeof getPrivate,
  storeActionsMock: typeof storeActions
) => ({ peerId, payload, respond, error }: TActionHandlerProps) => {
  const { secretKeyPlayerIdMap } = getPrivateMock();

  const playerId = secretKeyPlayerIdMap.get(payload.secretKey);

  if (!playerId) {
    return error(
      new GeneralError("Could not find playerId. Failed to reconnect.")
    );
  }

  storeActionsMock.setPlayerConnection(playerId, { peerId });

  return respond();
};

const handleReconnect = makeHandleReconnect(getPrivate, storeActions);

export default handleReconnect;
