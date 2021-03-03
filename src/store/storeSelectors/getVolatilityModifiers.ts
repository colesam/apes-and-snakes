import { TStore } from "../store";

export const getVolatilityModifiers = (stockTicker: string) => (s: TStore) =>
  s.stockVolatilityModifierMap.get(stockTicker) || [];
