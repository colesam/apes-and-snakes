import { Pair } from "../../core/card/Pair";
import { Stock } from "../../core/stock/Stock";

export const stocks = [
  new Stock({
    name: "GameStop",
    ticker: "GME",
    priceHistory: [20],
    rankHistory: [],
    pair: new Pair(),
  }),
  new Stock({
    name: "BestBuy",
    ticker: "BBY",
    priceHistory: [50],
    rankHistory: [],
    pair: new Pair(),
  }),
  new Stock({
    name: "Intel",
    ticker: "INTC",
    priceHistory: [65],
    rankHistory: [],
    pair: new Pair(),
  }),
  new Stock({
    name: "YouTube",
    ticker: "YTB",
    priceHistory: [80],
    rankHistory: [],
    pair: new Pair(),
  }),
  new Stock({
    name: "Tesla",
    ticker: "TSLA",
    priceHistory: [100],
    rankHistory: [],
    pair: new Pair(),
  }),
  new Stock({
    name: "Amazon",
    ticker: "AMZN",
    priceHistory: [150],
    rankHistory: [],
    pair: new Pair(),
  }),
  new Stock({
    name: "Medica",
    ticker: "MDC",
    priceHistory: [25],
    rankHistory: [],
    pair: new Pair(),
  }),
  new Stock({
    name: "Yorkshire Lobotomies",
    ticker: "YOLO",
    priceHistory: [69],
    rankHistory: [],
    pair: new Pair(),
  }),
  new Stock({
    name: "Lexington Concord",
    ticker: "LXCO",
    priceHistory: [50],
    rankHistory: [],
    pair: new Pair(),
  }),
  new Stock({
    name: "Chase",
    ticker: "CHAS",
    priceHistory: [72],
    rankHistory: [],
    pair: new Pair(),
  }),
];
