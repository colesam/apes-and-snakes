import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { TStore } from "../store";

export const pushVolatilityModifiers = (
  stockTicker: string,
  mods: VolatilityModifier[]
) => (s: TStore) => {
  s.stockVolatilityModifierMap.set(stockTicker, [
    ...(s.stockVolatilityModifierMap.get(stockTicker) || []),
    ...mods,
  ]);
};
