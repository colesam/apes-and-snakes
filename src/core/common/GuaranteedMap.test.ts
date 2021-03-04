import { enableMapSet, produce } from "immer";
import { GuaranteedMap } from "./GuaranteedMap";

beforeAll(() => {
  enableMapSet();
});

test("returns the default value if nothing is set for a key", () => {
  const map = new GuaranteedMap(() => "test");
  expect(map.get("key")).toBe("test");
});

test("returns set value if a value has been set for a key", () => {
  const map = new GuaranteedMap(() => "test", [["key", "value"]]);
  expect(map.get("key")).toBe("value");
});

test("allows for easy modifications with immer.js", () => {
  const map = new GuaranteedMap<string, string[]>(() => []);
  const newMap = produce(map, (draft: GuaranteedMap<string, string[]>) => {
    draft.get("key").push("value");
    draft.get("keyTwo").push("test1", "test2");
  });
  expect(map).not.toBe(newMap);
  expect(map).toMatchInlineSnapshot(`
    GuaranteedMap {
      "default": [Function],
      "map": Map {},
      Symbol(immer-draftable): true,
      Symbol(Symbol.iterator): [Function],
      Symbol(Symbol.toStringTag): "GuaranteedMap",
    }
  `);
  expect(newMap).toMatchInlineSnapshot(`
    GuaranteedMap {
      "default": [Function],
      "map": Map {
        "key" => Array [
          "value",
        ],
        "keyTwo" => Array [
          "test1",
          "test2",
        ],
      },
      Symbol(immer-draftable): true,
      Symbol(Symbol.iterator): [Function],
      Symbol(Symbol.toStringTag): "GuaranteedMap",
    }
  `);
});
