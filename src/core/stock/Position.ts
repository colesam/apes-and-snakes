import { ImmerClass } from "../ImmerClass";
import generateId from "../generateId";

interface TParams {
  id: string;
  quantity: number;
  purchasePrice: number;
  isClosed: boolean;
}

export class Position extends ImmerClass {
  protected readonly __class = "Position";

  public id;
  public quantity;
  public purchasePrice;
  public isClosed;

  constructor(
    {
      id = generateId(),
      quantity = 0,
      purchasePrice = 0,
      isClosed = false,
    } = {} as Partial<TParams>
  ) {
    super();
    this.id = id;
    this.quantity = quantity;
    this.purchasePrice = purchasePrice;
    this.isClosed = isClosed;
  }

  get initialValue() {
    return this.quantity * this.purchasePrice;
  }

  currentValue(currentPrice: number) {
    return this.quantity * currentPrice;
  }

  close() {
    this.isClosed = true;
  }
}
