import { sum } from "lodash";
import { TICKS_PER_WEEK } from "../../config";
import { ImmerClass } from "../ImmerClass";
import generateId from "../generateId";
import { Position } from "./Position";

interface TParams {
  id: string;
  openedAtTick: number;
  stockTicker: string;
  positions: Map<string, Position>;
  isSecured: boolean;
  isLiquidating: boolean;
  isLiquidated: boolean;
}

export class PositionBundle extends ImmerClass {
  protected readonly __class = "PositionBundle";

  public id;
  public openedAtTick;
  public stockTicker;
  public positions;
  public isSecured;
  public isLiquidating;
  public isLiquidated;

  constructor(
    {
      id = generateId(),
      openedAtTick = 0,
      stockTicker = "",
      positions = new Map<string, Position>(),
      isSecured = false,
      isLiquidating = false,
      isLiquidated = false,
    } = {} as Partial<TParams>
  ) {
    super();
    this.id = id;
    this.openedAtTick = openedAtTick;
    this.stockTicker = stockTicker;
    this.positions = positions;
    this.isSecured = isSecured;
    this.isLiquidating = isLiquidating;
    this.isLiquidated = isLiquidated;
  }

  push(quantity: number, purchasePrice: number) {
    const position = new Position({ quantity, purchasePrice });
    this.positions.set(position.id, position);
  }

  get positionList(): Position[] {
    return Array.from(this.positions).map(([, pos]) => pos);
  }

  get openPositionList(): Position[] {
    return this.positionList.filter(pos => !pos.isClosed);
  }

  get quantity(): number {
    return sum(this.openPositionList.map(pos => pos.quantity));
  }

  get initialValue(): number {
    return sum(this.openPositionList.map(pos => pos.initialValue));
  }

  currentValue(currentPrice: number): number {
    return sum(
      this.openPositionList.map(pos => pos.currentValue(currentPrice))
    );
  }

  capitalGainsTax(tick: number): number {
    const TICKS_PER_DAY = TICKS_PER_WEEK / 7;
    const daysSinceOpening = Math.floor(
      (tick - this.openedAtTick) / TICKS_PER_DAY
    );
    return Math.max(1 - daysSinceOpening * 0.05, 0);
  }
}

// TODO: Memoize the getters in this class
