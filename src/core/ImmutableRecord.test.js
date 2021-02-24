import { ImmutableRecord } from "./ImmutableRecord";

class TestClass extends ImmutableRecord {
  constructor(data) {
    super({ test: "default" }, data);
  }
}

test("immutable classes initialize with default options when no overrides", () => {
  const obj = new TestClass();
  expect(obj.test).toBe("default");
});

test("immutable classes automatically expose their data via getters", () => {
  const obj = new TestClass({ test: 123 });
  expect(obj.test).toBe(123);
});

test("sets __class to the constructor name by default", () => {
  const obj = new TestClass({});
  // noinspection JSUnresolvedVariable
  expect(obj.__class).toBe("TestClass");
});

test("manually defined getters are still callable", () => {
  class TestClassTwo extends ImmutableRecord {
    constructor(data) {
      super({ test: "default" }, data);
    }

    get testGetter() {
      return 456;
    }
  }
  const obj = new TestClassTwo({ test: 123 });
  expect(obj.testGetter).toBe(456);
});

test("overrides __class if passed in the constructor", () => {
  class TestClassTwo extends ImmutableRecord {
    constructor(data) {
      super({ test: "default" }, data, "Test123");
    }
  }
  const obj = new TestClassTwo();
  expect(obj.__class).toBe("Test123");
});
