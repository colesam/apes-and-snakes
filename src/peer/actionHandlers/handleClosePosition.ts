import { last } from "lodash";
import {
  SELL_MODIFIER_TICK_LIFETIME,
  SELL_ROLL_MODIFIER,
  SELL_VOLATILITY_MODIFIER,
} from "../../config";
import { RollModifier } from "../../core/stock/RollModifier";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
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
  const { stocks } = _getShared();
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
  if (!position || position.isClosed) {
    return error(
      new PeerError("Could not find positionId. Failed to close position.")
    );
  }

  // TODO make into some kind of getter
  const stockPriceMap = stocks.reduce<{ [key: string]: number }>(
    (acc, stock) => {
      acc[stock.ticker] = last(stock.priceHistory) || 0;
      return acc;
    },
    {}
  );

  // Push modifiers
  const { tick } = _getShared();
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

  _setShared(s => ({
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

  console.log("-- _getShared().players.find(player.id === playerId) --");
  console.log(_getShared().players.find(player => player.id === playerId));

  respond();
};

const handleClosePosition = makeHandleClosePosition(
  getShared,
  setShared,
  getPrivate,
  StoreAction
);

export default handleClosePosition;
