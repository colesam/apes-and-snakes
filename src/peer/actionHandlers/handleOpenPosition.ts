import {
  BUY_MODIFIER_TICK_LIFETIME,
  BUY_ROLL_MODIFIER,
  BUY_VOLATILITY_MODIFIER,
} from "../../config";
import { Position } from "../../core/stock/Position";
import { RollModifier } from "../../core/stock/RollModifier";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { StoreAction } from "../../store/StoreAction";
import { getPrivate } from "../../store/privateStore";
import { getShared, setShared } from "../../store/sharedStore";
import PeerError from "../error/PeerError";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleOpenPosition = (
  _getShared: typeof getShared,
  _setShared: typeof setShared,
  _getPrivate: typeof getPrivate,
  _StoreAction: typeof StoreAction
) => ({ payload, respond, error }: TActionHandlerProps) => {
  // Auth
  const { tick, players } = _getShared();
  const { secretKeyPlayerIdMap } = _getPrivate();
  const playerId = secretKeyPlayerIdMap[payload.secretKey];
  const player = players.find(p => p.id === playerId);

  if (!playerId || !player) {
    return error(
      new PeerError("Could not find playerId. Failed to reconnect.")
    );
  }

  // Validate price
  const transactionPrice = payload.price * payload.quantity;
  if (player.cash < transactionPrice) {
    return error(new PeerError("Cannot purchase. Not enough cash."));
  }

  // Apply mods
  _StoreAction.pushRollModifiers(payload.stockTicker, [
    new RollModifier({
      value: BUY_ROLL_MODIFIER,
      expirationTick: tick + BUY_MODIFIER_TICK_LIFETIME,
    }),
  ]);
  _StoreAction.pushVolatilityModifiers(payload.stockTicker, [
    new VolatilityModifier({
      value: BUY_VOLATILITY_MODIFIER * payload.quantity,
      expirationTick: tick + BUY_MODIFIER_TICK_LIFETIME + 10,
    }),
  ]);

  // Save position in storage
  const position = new Position({
    stockTicker: payload.stockTicker,
    quantity: payload.quantity,
    purchasePrice: payload.price,
  });

  _setShared(s => ({
    players: s.players.map(player =>
      player.id === playerId
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
  getShared,
  setShared,
  getPrivate,
  StoreAction
);

export default handleOpenPosition;
