import { Deck } from "./card/Deck";
import { Flop } from "./card/Flop";
import { Hand } from "./card/Hand";
import { Pair } from "./card/Pair";
import { serialize, deserialize, classMap } from "./serialize";

let deck: Deck, pair: Pair, flop: Flop, hand: Hand;

beforeEach(() => {
  deck = new Deck();
  pair = deck.shuffle().drawPair();
  flop = deck.shuffle().drawFlop();
  hand = new Hand({ pair, flop });
});

describe("serialize", () => {
  test("immutable objects serialize with `__class` and `data` properties", () => {
    const pair = new Pair();
    const res = serialize(pair);
    expect(res.indexOf('__class:"Pair"')).toBeTruthy();
    expect(res.indexOf("data:")).toBeTruthy();
  });

  test("immutable objects serialize recursively", () => {
    const res = serialize(hand);
    expect(res.split('__class:"Pair"')).toBeTruthy();
    expect(res.split('__class:"Flop"')).toBeTruthy();
    expect(res.split('__class:"Hand"')).toBeTruthy();
  });
});

describe("deserialize", () => {
  test("serialized immutable objects deserialize back into their class instances", () => {
    const res = serialize(pair);
    const des = deserialize(res, classMap);
    expect(des.constructor.name).toBe("Pair");
  });

  test("serialized immutable objects deserialize recursively", () => {
    const res = serialize(hand);
    const des = deserialize(res, classMap);
    expect(des.constructor.name).toBe("Hand");
    expect(des.cards.length).toBeTruthy();
  });

  test("deserialize throws an error if __class is missing from classMap", () => {
    const res = serialize(hand);
    expect(() => deserialize(res, {})).toThrow();
  });
});
