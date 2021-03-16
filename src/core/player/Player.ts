import { logError } from "../../util/log";
import { ImmerClass } from "../ImmerClass";
import { mapValuesToArray } from "../helpers";
import { Position } from "../stock/Position";
import { PositionBid } from "../stock/PositionBid";
import { PositionBundle } from "../stock/PositionBundle";
import { ConnectionStatus } from "./ConnectionStatus";
import { PlayerPortfolio } from "./PlayerPortfolio";

interface TParams {
  id: string;
  name: string;
  connectionStatus: ConnectionStatus;
  positionBundles: Map<string, PositionBundle>;
  positionBids: Map<string, PositionBid>;
  cash: number;
}

export class Player extends ImmerClass {
  protected readonly __class = "Player";

  public id;
  public name;
  public connectionStatus;
  public positionBundles;
  public positionBids;
  public cash;

  constructor(
    {
      id = "",
      name = "",
      connectionStatus = ConnectionStatus.CONNECTED,
      positionBundles = new Map<string, PositionBundle>(),
      positionBids = new Map<string, PositionBid>(),
      cash = 0,
    } = {} as Partial<TParams>
  ) {
    super();
    this.id = id;
    this.name = name;
    this.connectionStatus = connectionStatus;
    this.positionBundles = positionBundles;
    this.positionBids = positionBids;
    this.cash = cash;
  }

  getPortfolio(stockPriceMap: { [key: string]: number }) {
    const portfolio = new PlayerPortfolio();

    for (const bundle of this.positionBundleList) {
      portfolio.pushStockValue(
        bundle.stockTicker,
        bundle.currentValue(stockPriceMap[bundle.stockTicker])
      );
    }

    return portfolio;
  }

  // Bundle/position methods
  get positions(): Position[] {
    return this.positionBundleList.flatMap(bundle => bundle.positionList);
  }

  get positionBundleList(): PositionBundle[] {
    return mapValuesToArray(this.positionBundles);
  }

  pushBundle(bundle: PositionBundle) {
    if (this.positionBundles.has(bundle.id)) {
      throw new Error(`Cannot push duplicate bundle id: ${bundle.id}`);
    }
    this.positionBundles.set(bundle.id, bundle);
  }

  // Bid methods
  get positionBidList(): PositionBid[] {
    return mapValuesToArray(this.positionBids);
  }

  getBids(stockTicker: string) {
    return this.positionBidList.filter(p => p.stockTicker === stockTicker);
  }

  pushBid(bid: PositionBid) {
    if (this.positionBids.has(bid.id)) {
      throw new Error(`Cannot push duplicate bid id: ${bid.id}`);
    }
    this.positionBids.set(bid.id, bid);
  }

  closeBid(bidId: string) {
    if (this.positionBids.has(bidId)) {
      const bid = this.positionBids.get(bidId)!;
      this.pushBundle(bid.positionBundle);
      this.positionBids.delete(bid.id);
    } else {
      logError(
        `Failed to close bid #${bidId}. Could not locate in player #${this.id}.`
      );
    }
  }
}
