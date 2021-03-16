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
  const bundle = player.positionBundles.get(payload.bundleId);
  if (!bundle || bundle.quantity <= 0) {
    return error(
      new PeerError(
        `Could not find bundle #${payload.bundleId}. Failed to close position.`
      )
    );
  }

  setStore(StoreAction.closePosition(player.id, payload.bundleId));

  respond();
};

const handleClosePosition = makeHandleClosePosition(getStore, setStore);

export default handleClosePosition;
