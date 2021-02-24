import { DeepReadonly, ImmutableRecord } from "../ImmutableRecord";
import generateId from "../generateId";

export type TPosition = {
  id: string;
  stockTicker: string;
  quantity: number;
  purchasePrice: number;
  closed: boolean;
};

export interface Position extends DeepReadonly<TPosition> {}

export class Position extends ImmutableRecord<TPosition> {
  constructor(data?: Partial<TPosition>) {
    super(
      {
        id: generateId(),
        stockTicker: "",
        quantity: 0,
        purchasePrice: 0,
        closed: false,
      },
      data
    );
  }

  close() {
    return this.set({ closed: true });
  }
}
