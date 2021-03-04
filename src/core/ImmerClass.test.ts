import produce from "immer";
import { ImmerClass } from "./ImmerClass";

class Test extends ImmerClass {
  prop = 123;
}

test("can be extended and used with immer's produce()", () => {
  const test = new Test();
  const test_v2 = produce(test, draft => {
    draft.prop = 456;
  });

  expect(test).not.toBe(test_v2);
  expect(test.prop).toBe(123);
  expect(test_v2.prop).toBe(456);
});

test("creates a modified copy of itself using produce via the set method", () => {
  const test = new Test();
  const test_v2 = test.set(d => {
    d.prop = 456;
  });

  expect(test).not.toBe(test_v2);
  expect(test.prop).toBe(123);
  expect(test_v2.prop).toBe(456);
});
