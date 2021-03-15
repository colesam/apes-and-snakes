import { logError } from "../../util/log";
import { ImmerClass } from "../ImmerClass";
import { Position } from "../stock/Position";
import { PositionBid, PositionBidType } from "../stock/PositionBid";
import { PositionBundle } from "../stock/PositionBundle";
import { ConnectionStatus } from "./ConnectionStatus";
import { PlayerPortfolio } from "./PlayerPortfolio";

interface TParams {
  id: string;
  name: string;
  connectionStatus: ConnectionStatus;
  positionBundles: Map<string, PositionBundle>;
  positionBids: PositionBid[];
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
      positionBids = [],
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
    return Array.from(this.positionBundles).map(([, bundle]) => bundle);
  }

  pushBundle(bundle: PositionBundle) {
    if (this.positionBundles.has(bundle.id)) {
      throw new Error(`Cannot push duplicate bundle id: ${bundle.id}`);
    }
    this.positionBundles.set(bundle.id, bundle);
  }

  // Bid methods
  getBids(stockTicker: string) {
    return this.positionBids.filter(p => p.stockTicker === stockTicker);
  }

  pushBid(bid: PositionBid) {
    this.positionBids.push(bid);
  }

  closeBid(bidId: string) {
    const index = this.positionBids.findIndex(bid => bidId === bid.id);
    const bid = this.positionBids[index];
    const bundle = this.positionBundles.get(bid.positionBundleId);

    if (bundle) {
      bundle.isSecured = true;
      if (bid.type === PositionBidType.SELL) {
        bundle.isLiquidating = false;
      }
    } else {
      logError(
        `Could not find bundle #${bid.positionBundleId} when closing bid #${bid.id}.`
      );
    }

    this.positionBids.splice(index, 1);
  }
}
