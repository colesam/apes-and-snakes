import {
  BUY_MODIFIER_TICK_LIFETIME,
  BUY_ROLL_MODIFIER,
  BUY_VOLATILITY_MODIFIER,
} from "../../config";
import { Position } from "../../core/stock/Position";
import { RollModifier } from "../../core/stock/RollModifier";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { StoreAction } from "../StoreAction";
import { StoreSelector } from "../StoreSelector";
import { TStore } from "../store";

export const openPosition = (
  playerId: string,
  stockTicker: string,
  price: number,
  quantity: number
) => (s: TStore) => {
  const player = StoreSelector.getPlayer(playerId)(s);

  if (player) {
    const position = new Position({
      stockTicker,
      quantity,
      purchasePrice: price,
    });

    player.positions.push(position);
    player.cash -= position.initialValue;

    StoreAction.pushRollModifiers(stockTicker, [
      new RollModifier({
        value: BUY_ROLL_MODIFIER * quantity,
        expirationTick: s.tick + BUY_MODIFIER_TICK_LIFETIME,
        stackKey: "BUY",
      }),
    ])(s);

    StoreAction.pushVolatilityModifiers(stockTicker, [
      new VolatilityModifier({
        value: BUY_VOLATILITY_MODIFIER * quantity,
        expirationTick: s.tick + BUY_MODIFIER_TICK_LIFETIME + 20,
      }),
    ])(s);
  }
};
