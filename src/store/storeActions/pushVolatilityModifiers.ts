import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { setStore } from "../store";

export const pushVolatilityModifiers = (
  stockTicker: string,
  volMods: VolatilityModifier[]
) => {
  setStore(s => ({
    stockVolatilityModifierMap: {
      ...s.stockVolatilityModifierMap,
      [stockTicker]: [
        ...(s.stockVolatilityModifierMap[stockTicker] || []),
        ...volMods,
      ],
    },
  }));
};
