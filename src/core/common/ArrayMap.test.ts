import { enableMapSet } from "immer";
import { classMap, deserialize, serialize } from "../serialize";
import { ArrayMap } from "./ArrayMap";

beforeAll(() => {
  enableMapSet();
});

let map: ArrayMap<string, string>;

beforeEach(() => {
  map = new ArrayMap<string, string>({
    entries: [["test", ["sam", "kenz"]]],
  });
});

test("serializes correctly", () => {
  const res = serialize(map);
  expect(res.indexOf('__class:"ArrayMap"')).toBeTruthy();
  expect(res.indexOf("entries:")).toBeTruthy();
});

test("deserializes correctly", () => {
  const res = serialize(map);
  const des = deserialize(res, classMap);
  expect(des.constructor.name).toBe("ArrayMap");
  expect(des.get("test")).toEqual(["sam", "kenz"]);
});
