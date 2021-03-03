import { produce } from "immer";
import { RollModifier } from "../../core/stock/RollModifier";
import { setStore, TStore } from "../store";

export const pushRollModifiers = (
  stockTicker: string,
  mods: RollModifier[]
) => {
  setStore(
    produce((draft: TStore) => {
      const rollMods = draft.stockRollModifierMap.get(stockTicker) || [];
      rollMods.push(...mods);
      draft.stockRollModifierMap.set(stockTicker, rollMods);
    })
  );
};
