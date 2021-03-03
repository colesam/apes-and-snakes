import { produce } from "immer";
import { VolatilityModifier } from "../../core/stock/VolatilityModifier";
import { setStore } from "../store";

export const pushVolatilityModifiers = (
  stockTicker: string,
  mods: VolatilityModifier[]
) => {
  setStore(
    produce(draft => {
      const volMods = draft.stockVolatilityModifierMap.get(stockTicker) || [];
      volMods.push(...mods);
      draft.stockVolatilityModifierMap.set(stockTicker, volMods);
    })
  );
};
