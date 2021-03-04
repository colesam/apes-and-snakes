import { RollModifier } from "../../core/stock/RollModifier";
import { TStore } from "../store";

export const pushRollModifiers = (
  stockTicker: string,
  mods: RollModifier[]
) => (s: TStore) => {
  s.stockRollModifierMap.get(stockTicker).push(...mods);
};
