import { RollModifier } from "../../core/stock/RollModifier";
import { getPrivate, setPrivate } from "../privateStore";

export const pushRollModifiers = (
  stockTicker: string,
  rollMods: RollModifier[]
) => {
  const { stockRollModifierMap } = getPrivate();
  setPrivate({
    stockRollModifierMap: {
      ...stockRollModifierMap,
      [stockTicker]: [
        ...(stockRollModifierMap[stockTicker] || []),
        ...rollMods,
      ],
    },
  });
};
