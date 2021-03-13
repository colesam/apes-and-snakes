import produce, { enableMapSet } from "immer";
import { Player } from "../../core/player/Player";
import { StoreAction } from "../StoreAction";
import { stocks } from "../mockData/stocks";
import { TStore } from "../store";

const mockStoreData = {
  players: [new Player({ id: "s", name: "Sam", cash: 1_000_000 })],
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

  expect(tick1.players[0].positions.length).toBe(1);
  expect(tick1.players[0].positions[0].quantity).toBe(1_000);

  const tick2 = produce(tick1, (s: TStore) => {
    for (const stock of s.stocks) {
      StoreAction.updateStockBids(stock)(s);
    }
  });

  expect(tick2.players[0].positions.length).toBe(2);
  expect(tick2.players[0].positions[1].quantity).toBe(1_000);
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
