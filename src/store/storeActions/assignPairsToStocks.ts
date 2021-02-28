import { Deck } from "../../core/card/Deck";
import { setPrivate } from "../privateStore";
import { getShared, setShared } from "../sharedStore";

export const assignPairsToStocks = () => {
  const { stocks } = getShared();

  const [pairs, deck] = new Deck().shuffle().dealPairs(stocks.length);

  setShared({
    stocks: stocks.map((stock, i) => stock.set({ pair: pairs[i] })),
  });
  setPrivate({ deck });
};
