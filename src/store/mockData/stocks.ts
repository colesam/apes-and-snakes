import { Deck } from "../../core/card/Deck";
import { Stock } from "../../core/stock/Stock";

const [pairs, remainingDeck] = new Deck().shuffle().dealPairs(10);

export const deck = remainingDeck;

export const stocks = [
  new Stock({
    name: "GameStop",
    ticker: "GME",
    priceHistory: [150],
    rankHistory: [],
    pair: pairs[0],
  }),
  new Stock({
    name: "BestBuy",
    ticker: "BBY",
    priceHistory: [50],
    rankHistory: [],
    pair: pairs[1],
  }),
  new Stock({
    name: "Intel",
    ticker: "INTC",
    priceHistory: [55],
    rankHistory: [],
    pair: pairs[2],
  }),
  new Stock({
    name: "YouTube",
    ticker: "YTB",
    priceHistory: [80],
    rankHistory: [],
    pair: pairs[3],
  }),
  new Stock({
    name: "Tesla",
    ticker: "TSLA",
    priceHistory: [100],
    rankHistory: [],
    pair: pairs[4],
  }),
  new Stock({
    name: "Amazon",
    ticker: "AMZN",
    priceHistory: [200],
    rankHistory: [],
    pair: pairs[5],
  }),
  new Stock({
    name: "Medica",
    ticker: "MDC",
    priceHistory: [25],
    rankHistory: [],
    pair: pairs[6],
  }),
  new Stock({
    name: "Yorkshire Lobotomies",
    ticker: "YOLO",
    priceHistory: [69],
    rankHistory: [],
    pair: pairs[7],
  }),
  new Stock({
    name: "Lexington Concord",
    ticker: "LXCO",
    priceHistory: [50],
    rankHistory: [],
    pair: pairs[8],
  }),
  new Stock({
    name: "Chase",
    ticker: "CHAS",
    priceHistory: [72],
    rankHistory: [],
    pair: pairs[9],
  }),
];
