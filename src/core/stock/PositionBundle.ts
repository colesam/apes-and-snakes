import { sum } from "lodash";
import { ImmerClass } from "../ImmerClass";
import generateId from "../generateId";
import { Position } from "./Position";

interface TParams {
  id: string;
  stockTicker: string;
  positions: Map<string, Position>;
  isSecured: boolean;
}

export class PositionBundle extends ImmerClass {
  protected readonly __class = "PositionBundle";

  public id;
  public stockTicker;
  public positions;
  public isSecured;

  constructor(
    {
      id = generateId(),
      stockTicker = "",
      positions = new Map<string, Position>(),
      isSecured = false,
    } = {} as Partial<TParams>
  ) {
    super();
    this.id = id;
    this.stockTicker = stockTicker;
    this.positions = positions;
    this.isSecured = isSecured;
  }

  push(quantity: number, purchasePrice: number) {
    const position = new Position({ quantity, purchasePrice });
    this.positions.set(position.id, position);
  }

  get positionList() {
    return Array.from(this.positions);
  }

  get openPositionList() {
    return this.positionList.filter(([, pos]) => !pos.isClosed);
  }

  get quantity() {
    return sum(this.openPositionList.map(([, pos]) => pos.quantity));
  }

  get initialValue() {
    return sum(this.openPositionList.map(([, pos]) => pos.initialValue));
  }

  currentValue(currentPrice: number) {
    return sum(
      this.openPositionList.map(([, pos]) => pos.currentValue(currentPrice))
    );
  }
}
