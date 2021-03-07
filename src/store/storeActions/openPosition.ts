import { PositionBid } from "../../core/stock/PositionBid";
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
    const positionBundle = new PositionBundle({
      stockTicker,
    });

    const positionBid = new PositionBid({
      stockTicker,
      quantity,
      playerId: player.id,
      positionBundleId: positionBundle.id,
    });

    player.pushBundle(positionBundle);
    player.pushBid(positionBid);
  }
};
