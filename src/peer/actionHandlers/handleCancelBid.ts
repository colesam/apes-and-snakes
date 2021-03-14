import { StoreSelector } from "../../store/StoreSelector";
import { getStore, setStore } from "../../store/store";
import PeerError from "../error/PeerError";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleCancelBid = (
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

  // Validate bid
  const positionBid = player.positionBids.find(bid => bid.id === payload.bidId);
  if (!positionBid) {
    return error(
      new PeerError(
        `Could not find position bid #${payload.bidId}. Failed to cancel bid.`
      )
    );
  }

  _setStore(s => {
    const player = StoreSelector.getAuthorizedPlayer(payload.secretKey)(s)!;
    player.closeBid(payload.bidId);
  });

  respond();
};

const handleCancelBid = makeHandleCancelBid(getStore, setStore);

export default handleCancelBid;
