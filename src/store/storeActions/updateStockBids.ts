import { head, shuffle } from "lodash";
import { Player } from "../../core/player/Player";
import { Position } from "../../core/stock/Position";
import { PositionBidType } from "../../core/stock/PositionBid";
import { Stock } from "../../core/stock/Stock";
import { logDebug } from "../../util/log";
import { TStore } from "../store";

export const updateStockBids = (stock: Stock) => (s: TStore) => {
  updateBuys(stock)(s);
  updateSells(stock)(s);
};

const updateSells = (stock: Stock) => (s: TStore) => {
  const shuffledPlayers = shuffle(s.players);

  for (const player of shuffledPlayers) {
    if (stock.sellVolume < 1_000) break;

    const bids = player
      .getBids(stock.ticker)
      .filter(bid => bid.type === PositionBidType.SELL);

    if (bids.length < 1) continue;

    logDebug("Updating sell bids");

    const bid = bids[0];
    const bundle = player.positionBundles.get(bid.positionBundleId);

    if (bundle) {
      const position = head(bundle.openPositionList.map(([, pos]) => pos));
      if (!position) {
        // Should not get to this point
        bundle.isSecured = true;
        bundle.isLiquidating = false;
        bundle.isLiquidated = true;
        deleteBid(bid.id, player);
        continue;
      }

      const profit = position.currentValue(stock.price) - position.initialValue;
      const taxedProfit = profit - profit * bundle.capitalGainsTax(s.tick);

      position.isClosed = true;
      player.cash += position.initialValue + taxedProfit;
      stock.sellVolume -= position.quantity;
      stock.buyVolume = Math.min(15_000, stock.buyVolume + position.quantity);

      if (bundle.quantity === 0) {
        bundle.isSecured = true;
        bundle.isLiquidating = false;
        bundle.isLiquidated = true;
        deleteBid(bid.id, player);
      }
    } else {
      deleteBid(bid.id, player);
    }
  }
};

const updateBuys = (stock: Stock) => (s: TStore) => {
  const shuffledPlayers = shuffle(s.players);

  for (const player of shuffledPlayers) {
    if (stock.buyVolume < 1_000) break;

    const bids = player
      .getBids(stock.ticker)
      .filter(bid => bid.type === PositionBidType.BUY);

    if (bids.length < 1) continue;

    const purchasePrice = stock.price * 1_000;

    const bid = bids[0];
    const bundle = player.positionBundles.get(bid.positionBundleId);

    if (player.cash > purchasePrice && bundle) {
      const position = new Position({
        quantity: 1_000,
        purchasePrice: stock.price,
      });
      bundle.positions.set(position.id, position);
      player.cash -= purchasePrice;
      stock.buyVolume -= 1_000;
      stock.sellVolume = Math.min(15_000, stock.sellVolume + 1_000);
      if (bundle.quantity === bid.quantity) {
        bundle.isSecured = true;
        deleteBid(bid.id, player);
      }
    } else {
      if (bundle) bundle.isSecured = true;
      deleteBid(bid.id, player);
    }
  }
};

// TODO
const deleteBid = (bidId: string, player: Player) => {
  const index = player.positionBids.findIndex(({ id }) => bidId === id);
  player.positionBids.splice(index, 1);
};
