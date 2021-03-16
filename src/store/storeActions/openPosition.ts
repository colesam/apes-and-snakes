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
    const existingBid = player.positionBidList.find(
      bid => bid.stockTicker === stockTicker
    );

    if (existingBid) {
      // Merge order with existing bid
      existingBid.targetQuantity += quantity;
    } else {
      const positionBid = new PositionBid({
        playerId: player.id,
        type: PositionBidType.OPEN,
        startingQuantity: 0,
        targetQuantity: quantity,
        positionBundle: new PositionBundle({
          openedAtTick: s.tick,
          stockTicker,
        }),
      });

      player.pushBid(positionBid);
    }
  }
};
