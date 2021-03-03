import { TStore } from "../store";

export const getRollModifiers = (stockTicker: string) => (s: TStore) =>
  s.stockRollModifierMap.get(stockTicker) || [];
