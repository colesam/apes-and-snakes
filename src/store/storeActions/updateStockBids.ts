import { head, shuffle } from "lodash";
import { Player } from "../../core/player/Player";
import { Position } from "../../core/stock/Position";
import { PositionBid, PositionBidType } from "../../core/stock/PositionBid";
import { Stock } from "../../core/stock/Stock";
import { logWarning } from "../../util/log";
import { TStore } from "../store";

export const updateStockBids = (stock: Stock) => (s: TStore) => {
  updateBuys(stock)(s);
  updateSells(stock)(s);
};

const updateSells = (stock: Stock) => (s: TStore) => {
  updateBids(stock, PositionBidType.CLOSE, (player, bid) => {
    const bundle = bid.positionBundle;
    const position = head(bundle.openPositionList);

    if (!position) {
      // Should not get to this point
      logWarning(
        `Bundle #${bundle.id} in bid #${bid.id} does not have any open positions to sell. Closing bid.`
      );
      player.closeBid(bid.id);
      return;
    }

    const profit = position.currentValue(stock.price) - position.initialValue;
    const taxedProfit = profit - profit * bundle.capitalGainsTax(s.tick);

    position.isClosed = true;
    player.cash += position.initialValue + taxedProfit;
    stock.sellVolume -= position.quantity;
    stock.buyVolume = Math.min(15_000, stock.buyVolume + position.quantity);
  })(s);
};

const updateBuys = (stock: Stock) => (s: TStore) => {
  updateBids(stock, PositionBidType.OPEN, (player, bid) => {
    const bundle = bid.positionBundle;
    const purchasePrice = stock.price * 1_000;

    if (player.cash < purchasePrice) {
      player.closeBid(bid.id);
      return;
    }

    const position = new Position({
      quantity: 1_000,
      purchasePrice: stock.price,
    });

    bundle.positions.set(position.id, position);
    player.cash -= purchasePrice;
    stock.buyVolume -= 1_000;
    stock.sellVolume = Math.min(15_000, stock.sellVolume + 1_000);
  })(s);
};

const updateBids = (
  stock: Stock,
  bidType: PositionBidType,
  handleBid: (player: Player, bid: PositionBid) => void
) => (s: TStore) => {
  const shuffledPlayers = shuffle(s.players);

  for (const player of shuffledPlayers) {
    const bids = player
      .getBids(stock.ticker)
      .filter(bid => bid.type === bidType);

    if (bids.length < 1) continue;

    // Choose the first bid of its type for this player
    const bid = bids[0];

    handleBid(player, bid);

    if (bid.positionBundle.quantity === bid.targetQuantity) {
      player.closeBid(bid.id);
    }
  }
};
