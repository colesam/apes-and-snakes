import { ImmerClass } from "../ImmerClass";
import generateId from "../generateId";

export class Position extends ImmerClass {
  protected readonly __class = "Position";

  constructor(
    public id: string = generateId(),
    public stockTicker: string = "",
    public quantity: number = 0,
    public purchasePrice: number = 0,
    public isClosed: boolean = false
  ) {
    super();
  }

  close() {
    this.isClosed = true;
  }
}
