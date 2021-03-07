import { ImmerClass } from "../ImmerClass";
import { Position } from "../stock/Position";
import { PositionBid } from "../stock/PositionBid";
import { PositionBundle } from "../stock/PositionBundle";
import { ConnectionStatus } from "./ConnectionStatus";

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

  get positions(): Position[] {
    return this.positionBundleList.flatMap(bundle =>
      bundle.positionList.map(([, pos]) => pos)
    );
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

  pushBid(bid: PositionBid) {
    this.positionBids.push(bid);
  }

  getBids(stockTicker: string) {
    return this.positionBids.filter(p => p.stockTicker === stockTicker);
  }
}
