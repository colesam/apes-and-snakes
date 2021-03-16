import { PositionBid, PositionBidType } from "../../core/stock/PositionBid";
import { StoreSelector } from "../StoreSelector";
import { TStore } from "../store";

export const closePosition = (playerId: string, bundleId: string) => (
  s: TStore
) => {
  const player = StoreSelector.getPlayer(playerId)(s);
  const positionBundle = player?.positionBundles.get(bundleId);

  if (player && positionBundle) {
    const positionBid = new PositionBid({
      playerId: player.id,
      type: PositionBidType.CLOSE,
      targetQuantity: 0,
      positionBundle,
    });

    player.pushBid(positionBid);
  }
};
