import produce from "immer";
import { cloneDeep } from "lodash";
import { cardFromString } from "../../core/card/Card";
import { Flop } from "../../core/card/Flop";
import { Pair } from "../../core/card/Pair";
import { Stock } from "../../core/stock/Stock";
import { StoreAction } from "../StoreAction";
import { stocks } from "../mockData/stocks";
import { TStore } from "../store";

const pairs = [
  new Pair({ cards: [cardFromString("Qc"), cardFromString("5h")] }), // #1
  new Pair({ cards: [cardFromString("Js"), cardFromString("Jh")] }), // #2
  new Pair({ cards: [cardFromString("6h"), cardFromString("5c")] }), // #3
  new Pair({ cards: [cardFromString("2s"), cardFromString("4h")] }), // #4
  new Pair({ cards: [cardFromString("2h"), cardFromString("4s")] }), // #4
  new Pair({ cards: [cardFromString("2d"), cardFromString("4c")] }), // #4
];

const flop = new Flop({
  cards: [
    cardFromString("Ts"),
    cardFromString("Jc"),
    cardFromString("Ks"),
    cardFromString("Ad"),
    cardFromString("3c"),
  ],
});

let solvedStocks: Stock[];
beforeEach(() => {
  // Assign pairs to stocks and solve their hands with the flop
  solvedStocks = cloneDeep(stocks.slice(0, 6));
  solvedStocks.forEach((stock, i) => {
    stock.setPair(pairs[i], flop);
  });
});

test("ranks stocks in correct order", () => {
  const mockStore = { stocks: solvedStocks, flop } as TStore;
  const res = produce(mockStore, StoreAction.rankStocks);
  expect(res.stocks[0].rank).toBe(1);
  expect(res.stocks[1].rank).toBe(2);
  expect(res.stocks[2].rank).toBe(3);
  expect(res.stocks[3].rank).toBe(4);
  expect(res.stocks[4].rank).toBe(4);
  expect(res.stocks[5].rank).toBe(4);
});
