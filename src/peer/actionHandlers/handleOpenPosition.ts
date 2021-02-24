import { BUY_MODIFIER_TICK_LIFETIME, BUY_ROLL_MODIFIER } from "../../config";
import { Position } from "../../core/stock/Position";
import { RollModifier } from "../../core/stock/RollModifier";
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
  const { secretKeyPlayerIdMap } = _getPrivate();
  const playerId = secretKeyPlayerIdMap[payload.secretKey];
  if (!playerId) {
    return error(
      new PeerError("Could not find playerId. Failed to reconnect.")
    );
  }

  // Push modifiers
  const { tick } = _getShared();
  const numMods = Math.floor(payload.quantity / 1000);
  _StoreAction.pushRollModifiers(
    payload.stockTicker,
    [...Array(numMods)].map(
      _ =>
        new RollModifier({
          value: BUY_ROLL_MODIFIER,
          expirationTick: tick + BUY_MODIFIER_TICK_LIFETIME,
        })
    )
  );

  // Save position in storage
  const position = new Position({
    stockTicker: payload.stockTicker,
    quantity: payload.quantity,
    purchasePrice: payload.price,
  });
  _setShared(s => ({
    players: s.players.map(player =>
      player.id === playerId
        ? player.set({ positions: [...player.positions, position] })
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
