import { ImmerClass } from "../ImmerClass";
import generateId from "../generateId";

interface TParams {
  id: string;
  stockTicker: string;
  quantity: number;
  playerId: string;
  positionBundleId: string;
}

export class PositionBid extends ImmerClass {
  protected readonly __class = "PositionBid";

  public id;
  public stockTicker;
  public quantity;
  public playerId;
  public positionBundleId;

  constructor(
    {
      id = generateId(),
      stockTicker = "",
      quantity = 0,
      playerId = "",
      positionBundleId = "",
    } = {} as Partial<TParams>
  ) {
    super();
    this.id = id;
    this.stockTicker = stockTicker;
    this.quantity = quantity;
    this.playerId = playerId;
    this.positionBundleId = positionBundleId;
  }
}
