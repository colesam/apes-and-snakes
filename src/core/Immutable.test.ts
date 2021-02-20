import { deserialize } from "./Immutable";
import { Deck } from "./card/Deck";
import { Flop } from "./card/Flop";
import { Hand } from "./card/Hand";
import { Pair } from "./card/Pair";

let deck: Deck, pair: Pair, flop: Flop, hand: Hand;

beforeEach(() => {
  deck = new Deck();
  [pair] = deck.shuffle().drawPair();
  [flop] = deck.shuffle().drawFlop();
  hand = new Hand({ pair, flop });
});

describe("serialize", () => {
  test("immutable objects serialize with `__class` and `data` properties", () => {
    const res = JSON.stringify(pair);
    expect(res.indexOf('__class:"Pair"')).toBeTruthy();
    expect(res.indexOf("data:")).toBeTruthy();
  });

  test("immutable objects serialize recursively", () => {
    const res = JSON.stringify(hand);
    expect(res.split('__class:"Pair"')).toBeTruthy();
    expect(res.split('__class:"Flop"')).toBeTruthy();
    expect(res.split('__class:"Hand"')).toBeTruthy();
  });
});

describe("deserialize", () => {
  test("serialized immutable objects deserialize back into their class instances", () => {
    const res = JSON.stringify(pair);
    const des = deserialize(res, { Pair });
    expect(des.constructor.name).toBe("Pair");
  });

  test("serialized immutable objects deserialize recursively", () => {
    const res = JSON.stringify(hand);
    const des = deserialize(res, { Hand, Pair, Flop });
    expect(des.constructor.name).toBe("Hand");
    expect(des.cards.length).toBeTruthy();
  });

  test("deserialize throws an error if __class is missing from classMap", () => {
    const res = JSON.stringify(hand);
    expect(() => deserialize(res, {})).toThrow();
  });
});
