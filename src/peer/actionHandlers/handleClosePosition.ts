import { SELL_MODIFIER_TICK_LIFETIME, SELL_ROLL_MODIFIER } from "../../config";
import { RollModifier } from "../../core/stock/RollModifier";
import { StoreAction } from "../../store/StoreAction";
import { getPrivate } from "../../store/privateStore";
import { getShared, setShared } from "../../store/sharedStore";
import PeerError from "../error/PeerError";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleClosePosition = (
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

  // Find position
  const position = _getShared()
    .players.find(player => player.id === playerId)
    ?.positions.find(pos => pos.id === payload.positionId);
  if (!position) {
    return error(
      new PeerError("Could not find positionId. Failed to close position.")
    );
  }

  // Push modifiers
  const { tick } = _getShared();
  const numMods = Math.floor(position.quantity / 1000);
  _StoreAction.pushRollModifiers(
    position.stockTicker,
    [...Array(numMods)].map(
      _ =>
        new RollModifier({
          value: SELL_ROLL_MODIFIER,
          expirationTick: tick + SELL_MODIFIER_TICK_LIFETIME,
        })
    )
  );

  // Mark position closed
  _setShared(s => ({
    players: s.players.map(player =>
      player.id === playerId
        ? player.set({
            positions: player.positions.map(pos =>
              pos.id === position.id ? position.close() : position
            ),
          })
        : player
    ),
  }));

  respond();
};

const handleClosePosition = makeHandleClosePosition(
  getShared,
  setShared,
  getPrivate,
  StoreAction
);

export default handleClosePosition;
