import { PositionBid, PositionBidType } from "../../core/stock/PositionBid";
import { PositionBundle } from "../../core/stock/PositionBundle";
import { StoreSelector } from "../StoreSelector";
import { TStore } from "../store";

export const openPosition = (
  playerId: string,
  stockTicker: string,
  quantity: number
) => (s: TStore) => {
  const player = StoreSelector.getPlayer(playerId)(s);

  if (player) {
    // See if existing bid for stock exists
    const existingBid = player.positionBids.find(
      bid => bid.stockTicker === stockTicker
    );

    let existingBundle;
    if (existingBid) {
      existingBundle = player.positionBundleList.find(
        bundle =>
          bundle.id === existingBid.positionBundleId && !bundle.isSecured
      );
    }

    if (existingBid && existingBundle) {
      // Merge order with existing bid
      existingBid.quantity += quantity;
    } else {
      const positionBundle = new PositionBundle({
        openedAtTick: s.tick,
        stockTicker,
      });

      const positionBid = new PositionBid({
        stockTicker,
        type: PositionBidType.BUY,
        quantity,
        playerId: player.id,
        positionBundleId: positionBundle.id,
      });

      player.pushBundle(positionBundle);
      player.pushBid(positionBid);
    }
  }
};
