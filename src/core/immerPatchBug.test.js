import produce, {
  applyPatches,
  enableMapSet,
  enablePatches,
  immerable,
} from "immer";
import { cloneDeep } from "lodash";
import create from "zustand";
import { initialState } from "../store/store";

enableMapSet();
enablePatches();

class Stock {
  [immerable] = true;

  name;
  ticker;
  priceHistory;

  constructor({ name, ticker, priceHistory }) {
    this.name = name;
    this.ticker = ticker;
    this.priceHistory = priceHistory;
  }
}

const getStocks = () =>
  cloneDeep(
    new Map([
      [
        "GME",
        new Stock({
          name: "GameStop",
          ticker: "GME",
          priceHistory: [20],
        }),
      ],
      [
        "BBY",
        new Stock({
          name: "BestBuy",
          ticker: "BBY",
          priceHistory: [50],
        }),
      ],
      [
        "INTC",
        new Stock({
          name: "Intel",
          ticker: "INTC",
          priceHistory: [65],
        }),
      ],
      [
        "YTB",
        new Stock({
          name: "YouTube",
          ticker: "YTB",
          priceHistory: [80],
        }),
      ],
      [
        "TSLA",
        new Stock({
          name: "Tesla",
          ticker: "TSLA",
          priceHistory: [100],
        }),
      ],
      [
        "AMZN",
        new Stock({
          name: "Amazon",
          ticker: "AMZN",
          priceHistory: [150],
        }),
      ],
    ])
  );

let mockStore;
beforeEach(() => {
  mockStore = create(initialState);
  mockStore.setState(
    produce(mockStore.getState(), s => {
      for (const stock of s.stocks.values()) {
        stock.priceHistory.push(100);
      }
    })
  );
});

export const patch1 = [
  {
    op: "replace",
    path: ["stocks"],
    value: getStocks(),
  },
];

test("produces mutated state error", () => {
  const state = produce({ stocks: getStocks() }, s => {
    s.stocks.get("INTC").priceHistory.push(100);
  });

  const state2 = applyPatches(state, patch1);
  expect(state.stocks.get("INTC")).not.toBe(state2.stocks.get("INTC"));

  const state3 = produce(state2, s => {
    s.stocks.get("INTC").priceHistory.push(100);
  });

  expect(state2.stocks.get("INTC")).toBe(state3.stocks.get("INTC"));
});
