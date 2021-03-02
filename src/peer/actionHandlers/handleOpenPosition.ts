import {
  BUY_MODIFIER_TICK_LIFETIME,
  BUY_ROLL_MODIFIER,
  BUY_VOLATILITY_MODIFIER,
} from "../../config";
import { Position } from "../../core/stock/Position";
import { RollModifier } from "../../core/stock/RollModifier";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { StoreAction } from "../../store/StoreAction";
import { getStore, Selector, setStore } from "../../store/store";
import PeerError from "../error/PeerError";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleOpenPosition = (
  _getStore: typeof getStore,
  _setStore: typeof setStore,
  _StoreAction: typeof StoreAction
) => ({ payload, respond, error }: TActionHandlerProps) => {
  const { tick } = _getStore();
  const authorizedPlayer = Selector.getAuthorizedPlayer(_getStore())(
    payload.secretKey
  );

  if (!authorizedPlayer) {
    return error(new PeerError("Could not find player. Failed to reconnect."));
  }

  // Validate price
  const transactionPrice = payload.price * payload.quantity;
  if (authorizedPlayer.cash < transactionPrice) {
    return error(new PeerError("Cannot purchase. Not enough cash."));
  }

  // Apply mods
  _StoreAction.pushRollModifiers(payload.stockTicker, [
    new RollModifier({
      value: BUY_ROLL_MODIFIER * payload.quantity,
      expirationTick: tick + BUY_MODIFIER_TICK_LIFETIME,
      stackKey: "BUY",
    }),
  ]);
  _StoreAction.pushVolatilityModifiers(payload.stockTicker, [
    new VolatilityModifier({
      value: BUY_VOLATILITY_MODIFIER * payload.quantity,
      expirationTick: tick + BUY_MODIFIER_TICK_LIFETIME + 20,
    }),
  ]);

  // Save position in storage
  const position = new Position({
    stockTicker: payload.stockTicker,
    quantity: payload.quantity,
    purchasePrice: payload.price,
  });

  _setStore(s => ({
    players: s.players.map(player =>
      player.id === authorizedPlayer.id
        ? player.set({
            positions: [...player.positions, position],
            cash: player.cash - transactionPrice,
          })
        : player
    ),
  }));

  respond();
};

const handleOpenPosition = makeHandleOpenPosition(
  getStore,
  setStore,
  StoreAction
);

export default handleOpenPosition;
