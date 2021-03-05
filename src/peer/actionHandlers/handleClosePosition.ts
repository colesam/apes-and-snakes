import { StoreAction } from "../../store/StoreAction";
import { StoreSelector } from "../../store/StoreSelector";
import { getStore, setStore } from "../../store/store";
import PeerError from "../error/PeerError";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleClosePosition = (
  _getStore: typeof getStore,
  _setStore: typeof setStore
) => ({ payload, respond, error }: TActionHandlerProps) => {
  // Auth
  const player = StoreSelector.getAuthorizedPlayer(payload.secretKey)(
    _getStore()
  );
  if (!player) {
    return error(new PeerError("Could not find player."));
  }

  // Validate position
  const position = player.positions.find(pos => pos.id === payload.positionId);
  if (!position || position.isClosed) {
    return error(
      new PeerError("Could not find positionId. Failed to close position.")
    );
  }

  setStore(StoreAction.closePosition(player.id, position.id));

  respond();
};

const handleClosePosition = makeHandleClosePosition(getStore, setStore);

export default handleClosePosition;
