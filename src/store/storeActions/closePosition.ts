import {
  SELL_MODIFIER_TICK_LIFETIME,
  SELL_ROLL_MODIFIER,
  SELL_VOLATILITY_MODIFIER,
} from "../../config";
import { RollModifier } from "../../core/stock/RollModifier";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { StoreAction } from "../StoreAction";
import { StoreSelector } from "../StoreSelector";
import { TStore } from "../store";

export const closePosition = (playerId: string, positionId: string) => (
  s: TStore
) => {
  const stockPriceMap = StoreSelector.stockPriceMap(s);
  const player = StoreSelector.getPlayer(playerId)(s);
  const position = player?.positions.find(pos => pos.id === positionId);

  if (player && position) {
    const positionValue =
      position.quantity * stockPriceMap[position.stockTicker];

    player.cash += positionValue;

    position.close();

    StoreAction.pushRollModifiers(position.stockTicker, [
      new RollModifier({
        value: SELL_ROLL_MODIFIER * position.quantity,
        expirationTick: s.tick + SELL_MODIFIER_TICK_LIFETIME,
        stackKey: "CLOSE",
      }),
    ])(s);

    StoreAction.pushVolatilityModifiers(position.stockTicker, [
      new VolatilityModifier({
        value: SELL_VOLATILITY_MODIFIER * position.quantity,
        expirationTick: s.tick + SELL_MODIFIER_TICK_LIFETIME + 10,
      }),
    ])(s);
  }
};
