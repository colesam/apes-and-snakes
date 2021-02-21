import { ImmutableRecord } from "./ImmutableRecord";

test("immutable classes automatically expose their data via getters", () => {
  const obj = new ImmutableRecord({ test: 123 });
  expect(obj.test).toBe(123);
});

test("manually defined getters are still callable", () => {
  class TestClass extends ImmutableRecord {
    get testGetter() {
      return 456;
    }
  }
  const obj = new TestClass({ test: 123 });
  expect(obj.testGetter).toBe(456);
});

test("sets __class to the constructor name by default", () => {
  class TestClass extends ImmutableRecord {}
  const obj = new TestClass({});
  // noinspection JSUnresolvedVariable
  expect(obj.__class).toBe("TestClass");
});

test("overrides __class if passed in the constructor", () => {
  class TestClass extends ImmutableRecord {
    constructor(data) {
      super(data, "Test123");
    }
  }
  const obj = new TestClass({});
  expect(obj.__class).toBe("Test123");
});
