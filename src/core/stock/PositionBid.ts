import { ImmerClass } from "../ImmerClass";
import generateId from "../generateId";
import { PositionBundle } from "./PositionBundle";

interface TParams {
  id: string;
  playerId: string;
  type: PositionBidType;
  targetQuantity: number;
  positionBundle: PositionBundle;
}

export enum PositionBidType {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
}

export class PositionBid extends ImmerClass {
  protected readonly __class = "PositionBid";

  public id;
  public playerId;
  public type;
  public targetQuantity;
  public positionBundle;

  constructor(
    {
      id = generateId(),
      playerId = "",
      type = PositionBidType.OPEN,
      targetQuantity = 0,
      positionBundle = new PositionBundle(),
    } = {} as Partial<TParams>
  ) {
    super();
    this.id = id;
    this.type = type;
    this.targetQuantity = targetQuantity;
    this.playerId = playerId;
    this.positionBundle = positionBundle;
  }

  get stockTicker() {
    return this.positionBundle.stockTicker;
  }
}
