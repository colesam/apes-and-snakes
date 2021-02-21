import { Deck } from "../../core/card/Deck";
import { Stock } from "../../core/stock/Stock";

const [pairs, remainingDeck] = new Deck().shuffle().dealPairs(10);

export const deck = remainingDeck;

export const stocks = [
  new Stock({
    name: "GameStop",
    ticker: "GME",
    change: 0.513,
    priceHistory: [150],
    pair: pairs[0],
  }),
  new Stock({
    name: "BestBuy",
    ticker: "BBY",
    change: -0.125,
    priceHistory: [50],
    pair: pairs[1],
  }),
  new Stock({
    name: "Intel",
    ticker: "INTC",
    change: -0.05,
    priceHistory: [55],
    pair: pairs[2],
  }),
  new Stock({
    name: "YouTube",
    ticker: "YTB",
    change: +0.8,
    priceHistory: [80],
    pair: pairs[3],
  }),
  new Stock({
    name: "Tesla",
    ticker: "TSLA",
    change: -0.125,
    priceHistory: [100],
    pair: pairs[4],
  }),
  new Stock({
    name: "Amazon",
    ticker: "AMZN",
    change: -0.314,
    priceHistory: [200],
    pair: pairs[5],
  }),
  new Stock({
    name: "Medica",
    ticker: "MDC",
    change: 0.33,
    priceHistory: [25],
    pair: pairs[6],
  }),
  new Stock({
    name: "Yorkshire Lobotomies",
    ticker: "YOLO",
    change: 0.69,
    priceHistory: [69],
    pair: pairs[7],
  }),
  new Stock({
    name: "Lexington Concord",
    ticker: "LXCO",
    change: -0.132,
    priceHistory: [50],
    pair: pairs[8],
  }),
  new Stock({
    name: "Chase",
    ticker: "CHAS",
    change: -0.122,
    priceHistory: [72],
    pair: pairs[9],
  }),
];
