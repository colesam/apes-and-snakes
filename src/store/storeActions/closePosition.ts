import { PositionBid, PositionBidType } from "../../core/stock/PositionBid";
import { StoreSelector } from "../StoreSelector";
import { TStore } from "../store";

export const closePosition = (playerId: string, bundleId: string) => (
  s: TStore
) => {
  const player = StoreSelector.getPlayer(playerId)(s);
  const bundle = player?.positionBundles.get(bundleId);

  if (player && bundle) {
    const positionBid = new PositionBid({
      stockTicker: bundle.stockTicker,
      type: PositionBidType.SELL,
      quantity: bundle.quantity,
      playerId: player.id,
      positionBundleId: bundle.id,
    });

    player.pushBid(positionBid);
  }
};
