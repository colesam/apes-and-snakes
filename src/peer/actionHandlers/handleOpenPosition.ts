import { StoreAction } from "../../store/StoreAction";
import { StoreSelector } from "../../store/StoreSelector";
import { getStore, setStore } from "../../store/store";
import PeerError from "../error/PeerError";
import { TActionHandlerProps } from "../handleAction";

// Testing note: Only test validation, leave other testing to the StoreAction
export const makeHandleOpenPosition = (
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

  // Validate price
  const transactionPrice = payload.price * payload.quantity;
  if (player.cash < transactionPrice) {
    return error(new PeerError("Failed to open position. Not enough cash."));
  }

  _setStore(
    StoreAction.openPosition(player.id, payload.stockTicker, payload.quantity)
  );

  respond();
};

const handleOpenPosition = makeHandleOpenPosition(getStore, setStore);

export default handleOpenPosition;
