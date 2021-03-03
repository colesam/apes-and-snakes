import { RollModifier } from "../../core/stock/RollModifier";
import { setStore } from "../store";

export const pushRollModifiers = (
  stockTicker: string,
  rollMods: RollModifier[]
) => {
  setStore(s => ({
    stockRollModifierMap: {
      ...s.stockRollModifierMap,
      [stockTicker]: [
        ...(s.stockRollModifierMap[stockTicker] || []),
        ...rollMods,
      ],
    },
  }));
};
