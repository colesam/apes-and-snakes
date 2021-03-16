import produce, { enableMapSet } from "immer";
import { Player } from "../../core/player/Player";
import { StoreAction } from "../StoreAction";
import { stocks } from "../mockData/stocks";
import { TStore } from "../store";

const mockStoreData = {
  players: [
    new Player({ id: "s", name: "Sam", cash: 1_000_000 }),
    new Player({ id: "k", name: "Kenzie", cash: 1_000_000 }),
  ],
  stocks: stocks,
};

let mockStore: TStore;

beforeAll(() => {
  enableMapSet();
});

beforeEach(() => {
  // TODO: actually test this in another file
  // @ts-ignore
  mockStore = produce(mockStoreData, (s: TStore) => {
    StoreAction.openPosition("s", "INTC", 5_000)(s);
  });
});

test("pushes 1_000 shares per tick if the stock is not squeezed", () => {
  const tick1 = produce(mockStore, (s: TStore) => {
    for (const stock of s.stocks) {
      StoreAction.updateStockBids(stock)(s);
    }
  });

  const tick1Positions =
    tick1.players[0].positionBidList[0].positionBundle.positionList;

  expect(tick1Positions.length).toBe(1);
  expect(tick1Positions[0].quantity).toBe(1_000);

  const tick2 = produce(tick1, (s: TStore) => {
    for (const stock of s.stocks) {
      StoreAction.updateStockBids(stock)(s);
    }
  });

  const tick2Positions =
    tick2.players[0].positionBidList[0].positionBundle.positionList;

  expect(tick2Positions.length).toBe(2);
  expect(tick2Positions[0].quantity).toBe(1_000);
});

test("pushes no more than the available amount of stocks per call", () => {
  const mockStore = produce(mockStoreData, (s: TStore) => {
    const intc = s.stocks.find(stock => stock.ticker === "INTC")!;
    intc.buyVolume = 1_000;

    StoreAction.openPosition("s", "INTC", 5_000)(s);
    StoreAction.openPosition("k", "INTC", 5_000)(s);
  });

  const tick1 = produce(mockStore, (s: TStore) => {
    for (const stock of s.stocks) {
      StoreAction.updateStockBids(stock)(s);
    }
  });

  // The 1_000 shares will be assigned to one player at random
  const combinedPositions = [
    ...tick1.players[0].positionBidList.flatMap(
      bid => bid.positionBundle.positionList
    ),
    ...tick1.players[1].positionBidList.flatMap(
      bid => bid.positionBundle.positionList
    ),
  ];
  expect(combinedPositions.length).toBe(1);
  expect(combinedPositions[0].quantity).toBe(1_000);
});

test("removes the bid if player doesn't have enough cash", () => {
  const tick1 = produce(mockStore, (s: TStore) => {
    s.players[0].cash = 0;
    for (const stock of s.stocks) {
      StoreAction.updateStockBids(stock)(s);
    }
  });
  expect(tick1.players[0].getBids("INTC").length).toBe(0);
});

test("removes the bid if the target quantity is reached", () => {
  let update: TStore = mockStore;
  for (let i = 0; i < 5; i++) {
    update = produce(update, (s: TStore) => {
      for (const stock of s.stocks) {
        StoreAction.updateStockBids(stock)(s);
      }
    });
  }
  expect(update.players[0].getBids("INTC").length).toBe(0);
});
