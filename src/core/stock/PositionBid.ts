import { ImmerClass } from "../ImmerClass";
import generateId from "../generateId";

interface TParams {
  id: string;
  type: PositionBidType;
  stockTicker: string;
  quantity: number;
  playerId: string;
  positionBundleId: string;
}

export enum PositionBidType {
  BUY = "BUY",
  SELL = "SELL",
}

export class PositionBid extends ImmerClass {
  protected readonly __class = "PositionBid";

  public id;
  public type;
  public stockTicker;
  public quantity;
  public playerId;
  public positionBundleId;

  constructor(
    {
      id = generateId(),
      type = PositionBidType.BUY,
      stockTicker = "",
      quantity = 0,
      playerId = "",
      positionBundleId = "",
    } = {} as Partial<TParams>
  ) {
    super();
    this.id = id;
    this.type = type;
    this.stockTicker = stockTicker;
    this.quantity = quantity;
    this.playerId = playerId;
    this.positionBundleId = positionBundleId;
  }
}
