import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { setStore } from "../store";

export const pushVolatilityModifiers = (
  stockTicker: string,
  mods: VolatilityModifier[]
) => {
  setStore(draft => {
    draft.stockVolatilityModifierMap.get(stockTicker).push(...mods);
  });
};
