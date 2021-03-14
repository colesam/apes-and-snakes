import { head, shuffle } from "lodash";
import { Player } from "../../core/player/Player";
import { Position } from "../../core/stock/Position";
import { PositionBid, PositionBidType } from "../../core/stock/PositionBid";
import { PositionBundle } from "../../core/stock/PositionBundle";
import { Stock } from "../../core/stock/Stock";
import { logError } from "../../util/log";
import { TStore } from "../store";

export const updateStockBids = (stock: Stock) => (s: TStore) => {
  updateBuys(stock)(s);
  updateSells(stock)(s);
};

const updateSells = (stock: Stock) => (s: TStore) => {
  updateBids(stock, PositionBidType.SELL, (player, bundle, bid) => {
    const position = head(bundle.openPositionList);

    if (!position) {
      // Should not get to this point
      player.closeBid(bid.id);
      return;
    }

    const profit = position.currentValue(stock.price) - position.initialValue;
    const taxedProfit = profit - profit * bundle.capitalGainsTax(s.tick);

    position.isClosed = true;
    player.cash += position.initialValue + taxedProfit;
    stock.sellVolume -= position.quantity;
    stock.buyVolume = Math.min(15_000, stock.buyVolume + position.quantity);

    if (bundle.quantity === 0) {
      player.closeBid(bid.id);
    }
  })(s);
};

const updateBuys = (stock: Stock) => (s: TStore) => {
  updateBids(stock, PositionBidType.BUY, (player, bundle, bid) => {
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

    if (bundle.quantity === bid.quantity) {
      player.closeBid(bid.id);
    }
  })(s);
};

const updateBids = (
  stock: Stock,
  bidType: PositionBidType,
  handleBundle: (
    player: Player,
    bundle: PositionBundle,
    bid: PositionBid
  ) => void
) => (s: TStore) => {
  const shuffledPlayers = shuffle(s.players);

  for (const player of shuffledPlayers) {
    const bids = player
      .getBids(stock.ticker)
      .filter(bid => bid.type === bidType);

    if (bids.length < 1) continue;

    const bid = bids[0];
    const bundle = player.positionBundles.get(bid.positionBundleId);

    if (bundle) {
      handleBundle(player, bundle, bid);
    } else {
      logError(
        `Failed to find bundle #${bid.positionBundleId}, in bid #${bid.id}`
      );
      player.closeBid(bid.id);
    }
  }
};
