import {
  SELL_MODIFIER_TICK_LIFETIME,
  SELL_ROLL_MODIFIER,
  SELL_VOLATILITY_MODIFIER,
} from "../../config";
import { RollModifier } from "../../core/stock/RollModifier";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { StoreAction } from "../../store/StoreAction";
import { StoreSelector } from "../../store/StoreSelector";
import { getStore, setStore } from "../../store/store";
import PeerError from "../error/PeerError";
import { TActionHandlerProps } from "../handleAction";

export const makeHandleClosePosition = (
  _getStore: typeof getStore,
  _setStore: typeof setStore,
  _StoreAction: typeof StoreAction
) => ({ payload, respond, error }: TActionHandlerProps) => {
  const { tick, secretKeyPlayerIdMap, players } = _getStore();
  const stockPriceMap = StoreSelector.stockPriceMap(_getStore());

  // Auth
  const playerId = secretKeyPlayerIdMap[payload.secretKey];

  if (!playerId) {
    return error(
      new PeerError("Could not find playerId. Failed to reconnect.")
    );
  }

  // Find position
  const position = players
    .find(player => player.id === playerId)
    ?.positions.find(pos => pos.id === payload.positionId);

  if (!position || position.isClosed) {
    return error(
      new PeerError("Could not find positionId. Failed to close position.")
    );
  }

  // Push modifiers
  _StoreAction.pushRollModifiers(position.stockTicker, [
    new RollModifier({
      value: SELL_ROLL_MODIFIER * position.quantity,
      expirationTick: tick + SELL_MODIFIER_TICK_LIFETIME,
      stackKey: "CLOSE",
    }),
  ]);
  _StoreAction.pushVolatilityModifiers(position.stockTicker, [
    new VolatilityModifier({
      value: SELL_VOLATILITY_MODIFIER * position.quantity,
      expirationTick: tick + SELL_MODIFIER_TICK_LIFETIME + 10,
    }),
  ]);

  // Mark position closed
  const positionValue = position.quantity * stockPriceMap[position.stockTicker];

  _setStore(s => ({
    players: s.players.map(player =>
      player.id === playerId
        ? player.set({
            positions: player.positions.map(pos =>
              pos.id === position.id ? pos.close() : pos
            ),
            cash: player.cash + positionValue,
          })
        : player
    ),
  }));

  respond();
};

const handleClosePosition = makeHandleClosePosition(
  getStore,
  setStore,
  StoreAction
);

export default handleClosePosition;
