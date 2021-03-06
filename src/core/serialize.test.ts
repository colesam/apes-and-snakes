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
  test("objects serialize with `__class` property", () => {
    const pair = new Pair();
    const res = serialize(pair);
    expect(res.indexOf('"__class":"Pair"')).toBeGreaterThan(-1);
  });

  test("objects serialize recursively", () => {
    const res = serialize(hand);
    expect(res.split('__class:"Pair"')).toBeTruthy();
    expect(res.split('__class:"Flop"')).toBeTruthy();
    expect(res.split('__class:"Hand"')).toBeTruthy();
  });
});

describe("deserialize", () => {
  test("serialized objects deserialize back into their class instances", () => {
    const res = serialize(pair);
    const des = deserialize(res, classMap);
    expect(des.constructor.name).toBe("Pair");
  });

  test("serialized objects deserialize recursively", () => {
    const res = serialize(hand);
    const des = deserialize(res, classMap);
    expect(des.constructor.name).toBe("Hand");
    expect(des.cards.length).toBeTruthy();
  });

  test("deserialize throws an error if `__class` is missing from classMap", () => {
    const res = serialize(hand);
    expect(() => deserialize(res, {})).toThrow();
  });

  test("serialized maps deserialize back to a map", () => {
    const map = new Map([["key", new Pair()]]);
    const des = deserialize(serialize(map), classMap);
    expect(des.constructor.name).toBe("Map");
    expect(des.get("key")).toEqual(new Pair());
  });
});
