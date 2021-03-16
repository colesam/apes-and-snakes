import { sum } from "lodash";
import { TICKS_PER_WEEK } from "../../config";
import { ImmerClass } from "../ImmerClass";
import generateId from "../generateId";
import { mapValuesToArray } from "../helpers";
import { Position } from "./Position";

interface TParams {
  id: string;
  openedAtTick: number;
  stockTicker: string;
  positions: Map<string, Position>;
  isSecured: boolean;
  isLiquidating: boolean;
}

export class PositionBundle extends ImmerClass {
  protected readonly __class = "PositionBundle";

  public id;
  public openedAtTick;
  public stockTicker;
  public positions;

  constructor(
    {
      id = generateId(),
      openedAtTick = 0,
      stockTicker = "",
      positions = new Map<string, Position>(),
    } = {} as Partial<TParams>
  ) {
    super();
    this.id = id;
    this.openedAtTick = openedAtTick;
    this.stockTicker = stockTicker;
    this.positions = positions;
  }

  /**
   * Deep clone of this bundle. All IDs are persisted but objects can be mutated. Used for
   * CLOSE bid types.
   */
  get clone(): PositionBundle {
    const positionEntriesClones: [string, Position][] = Array.from(
      this.positions
    ).map(([key, pos]) => [key, new Position(pos)]);

    return new PositionBundle({
      ...this,
      positions: new Map<string, Position>(positionEntriesClones),
    });
  }

  push(quantity: number, purchasePrice: number) {
    const position = new Position({ quantity, purchasePrice });
    this.positions.set(position.id, position);
  }

  get positionList(): Position[] {
    return mapValuesToArray(this.positions);
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

  get isLiquidated(): boolean {
    return this.quantity === 0;
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
