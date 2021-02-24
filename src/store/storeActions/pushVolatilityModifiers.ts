import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { getPrivate, setPrivate } from "../privateStore";

export const pushVolatilityModifiers = (
  stockTicker: string,
  volMods: VolatilityModifier[]
) => {
  const { stockVolatilityModifierMap } = getPrivate();
  setPrivate({
    stockVolatilityModifierMap: {
      ...stockVolatilityModifierMap,
      [stockTicker]: [
        ...(stockVolatilityModifierMap[stockTicker] || []),
        ...volMods,
      ],
    },
  });
};
