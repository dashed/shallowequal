describe("shallowequal", function() {
  let shallowequal;

  // eslint-disable-next-line no-sparse-arrays
  const falsey = [, "", 0, false, NaN, null, undefined];

  beforeEach(() => {
    // isolated instances of shallowequal for each test.
    jest.resetModules();
    shallowequal = jest.requireActual("../index.js");
  });

  // test cases copied from https://github.com/facebook/fbjs/blob/82247de1c33e6f02a199778203643eaee16ea4dc/src/core/__tests__/shallowEqual-test.js
  it("returns false if either argument is null", () => {
    expect(shallowequal(null, {})).toEqual(false);
    expect(shallowequal({}, null)).toEqual(false);
  });

  it("returns true if both arguments are null or undefined", () => {
    expect(shallowequal(null, null)).toEqual(true);
    expect(shallowequal(undefined, undefined)).toEqual(true);
  });

  it("returns true if arguments are shallow equal", () => {
    expect(shallowequal({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toEqual(
      true
    );
  });

  it("returns false if arguments are not objects and not equal", () => {
    expect(shallowequal(1, 2)).toEqual(false);
  });

  it("returns false if only one argument is not an object", () => {
    expect(shallowequal(1, {})).toEqual(false);
  });

  it("returns false if first argument has too many keys", () => {
    expect(shallowequal({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toEqual(false);
  });

  it("returns false if second argument has too many keys", () => {
    expect(shallowequal({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toEqual(false);
  });

  it("returns true if values are not primitives but are ===", () => {
    let obj = {};
    expect(
      shallowequal({ a: 1, b: 2, c: obj }, { a: 1, b: 2, c: obj })
    ).toEqual(true);
  });

  // subsequent test cases are copied from lodash tests
  it("returns false if arguments are not shallow equal", () => {
    expect(shallowequal({ a: 1, b: 2, c: {} }, { a: 1, b: 2, c: {} })).toEqual(
      false
    );
  });

  it("should provide the correct `customizer` arguments", () => {
    let argsList = [];
    const arry = [1, 2];
    const object1 = { a: arry, b: null };
    const object2 = { a: arry, b: null };

    object1.b = object2;
    object2.b = object1;

    const expected = [
      [object1, object2],
      [object1.a, object2.a, "a"],
      [object1.b, object2.b, "b"]
    ];

    shallowequal(object1, object2, function(...args) {
      argsList.push(args);
    });

    expect(argsList).toEqual(expected);
  });

  it("should set the `this` binding", () => {
    const actual = shallowequal(
      "a",
      "b",
      function(a, b) {
        return this[a] == this[b];
      },
      { a: 1, b: 1 }
    );

    expect(actual).toEqual(true);
  });

  it("should handle comparisons if `customizer` returns `undefined`", () => {
    const noop = () => void 0;

    expect(shallowequal("a", "a", noop)).toEqual(true);
    expect(shallowequal(["a"], ["a"], noop)).toEqual(true);
    expect(shallowequal({ "0": "a" }, { "0": "a" }, noop)).toEqual(true);
  });

  it("should not handle comparisons if `customizer` returns `true`", () => {
    const customizer = function(value) {
      return typeof value === "string" || undefined;
    };

    expect(shallowequal("a", "b", customizer)).toEqual(true);
    expect(shallowequal(["a"], ["b"], customizer)).toEqual(true);
    expect(shallowequal({ "0": "a" }, { "0": "b" }, customizer)).toEqual(true);
  });

  it("should not handle comparisons if `customizer` returns `false`", () => {
    const customizer = function(value) {
      return typeof value === "string" ? false : undefined;
    };

    expect(shallowequal("a", "a", customizer)).toEqual(false);
    expect(shallowequal(["a"], ["a"], customizer)).toEqual(false);
    expect(shallowequal({ "0": "a" }, { "0": "a" }, customizer)).toEqual(false);
  });

  it("should return a boolean value even if `customizer` does not", () => {
    let actual = shallowequal("a", "b", () => "c");
    expect(actual).toEqual(true);

    const values = falsey.filter(v => v !== undefined);
    const expected = values.map(() => false);

    actual = [];
    values.forEach(value => {
      actual.push(shallowequal("a", "a", () => value));
    });

    expect(actual).toEqual(expected);
  });

  it("should treat objects created by `Object.create(null)` like any other plain object", () => {
    function Foo() {
      this.a = 1;
    }
    Foo.prototype.constructor = null;

    const object2 = { a: 1 };
    expect(shallowequal(new Foo(), object2)).toEqual(true);

    const object1 = Object.create(null);
    object1.a = 1;
    expect(shallowequal(object1, object2)).toEqual(true);
  });
});
