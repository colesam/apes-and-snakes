import { Deck } from "../../core/card/Deck";
import { getStore, setStore } from "../store";

export const assignPairsToStocks = () => {
  const { stocks } = getStore();

  const [pairs, deck] = new Deck().shuffle().dealPairs(stocks.length);

  setStore({
    stocks: stocks.map((stock, i) => stock.set({ pair: pairs[i] })),
    deck,
  });
};
