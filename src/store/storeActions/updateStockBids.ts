import { shuffle } from "lodash";
import { Player } from "../../core/player/Player";
import { Position } from "../../core/stock/Position";
import { TStore } from "../store";

export const updateStockBids = (s: TStore) => {
  for (const stock of s.stocks) {
    if (stock.buyVolume < 1_000) break;

    const shuffledPlayers = shuffle(s.players);

    for (const player of shuffledPlayers) {
      const bids = player.getBids(stock.ticker);
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
        if (bundle.quantity === bid.quantity) {
          bundle.isSecured = true;
          deleteBid(bid.id, player);
        }
      } else {
        if (bundle) bundle.isSecured = true;
        deleteBid(bid.id, player);
      }
    }
  }
};

// TODO
const deleteBid = (bidId: string, player: Player) => {
  const index = player.positionBids.findIndex(({ id }) => bidId === id);
  player.positionBids.splice(index, 1);
};
