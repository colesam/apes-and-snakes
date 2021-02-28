import { RollModifier } from "../../core/stock/RollModifier";
import { getPrivate, setPrivate } from "../privateStore";

const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);

export const pushRollModifiers = (
  stockTicker: string,
  rollMods: RollModifier[]
) => {
  const { stockRollModifierMap } = getPrivate();
  const updatedMods = [
    ...(stockRollModifierMap[stockTicker] || []),
    ...rollMods,
  ];

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
