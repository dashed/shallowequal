import { describe, it, expect } from "vitest";
import shallowequal from "../src/index";

describe("shallowequal", () => {
  // eslint-disable-next-line no-sparse-arrays
  const falsey = [, "", 0, false, NaN, null, undefined];

  describe("primitive values", () => {
    it("returns true for identical strings", () => {
      expect(shallowequal("hello", "hello")).toEqual(true);
      expect(shallowequal("", "")).toEqual(true);
    });

    it("returns false for different strings", () => {
      expect(shallowequal("hello", "world")).toEqual(false);
      expect(shallowequal("hello", "Hello")).toEqual(false);
    });

    it("returns true for identical numbers", () => {
      expect(shallowequal(42, 42)).toEqual(true);
      expect(shallowequal(0, 0)).toEqual(true);
      expect(shallowequal(-1, -1)).toEqual(true);
      expect(shallowequal(3.14, 3.14)).toEqual(true);
    });

    it("returns false for different numbers", () => {
      expect(shallowequal(1, 2)).toEqual(false);
      expect(shallowequal(0, 1)).toEqual(false);
    });

    it("returns true for identical booleans", () => {
      expect(shallowequal(true, true)).toEqual(true);
      expect(shallowequal(false, false)).toEqual(true);
    });

    it("returns false for different booleans", () => {
      expect(shallowequal(true, false)).toEqual(false);
    });

    it("returns true for identical symbols", () => {
      const sym = Symbol("test");
      expect(shallowequal(sym, sym)).toEqual(true);
    });

    it("returns false for different symbols with same description", () => {
      expect(shallowequal(Symbol("test"), Symbol("test"))).toEqual(false);
    });

    it("returns true for identical bigints", () => {
      expect(shallowequal(BigInt(123), BigInt(123))).toEqual(true);
      expect(shallowequal(9007199254740991n, 9007199254740991n)).toEqual(true);
    });

    it("returns false for different bigints", () => {
      expect(shallowequal(BigInt(123), BigInt(456))).toEqual(false);
    });
  });

  describe("special values", () => {
    it("returns true for NaN compared to NaN (using Object.is)", () => {
      expect(shallowequal(NaN, NaN)).toEqual(true);
    });

    it("returns false for +0 compared to -0 (using Object.is)", () => {
      expect(shallowequal(+0, -0)).toEqual(false);
      expect(shallowequal(-0, +0)).toEqual(false);
    });

    it("returns true for Infinity", () => {
      expect(shallowequal(Infinity, Infinity)).toEqual(true);
      expect(shallowequal(-Infinity, -Infinity)).toEqual(true);
    });

    it("returns false for Infinity vs -Infinity", () => {
      expect(shallowequal(Infinity, -Infinity)).toEqual(false);
    });

    it("returns true if both arguments are null or undefined", () => {
      expect(shallowequal(null, null)).toEqual(true);
      expect(shallowequal(undefined, undefined)).toEqual(true);
    });

    it("returns false for null vs undefined", () => {
      expect(shallowequal(null, undefined)).toEqual(false);
      expect(shallowequal(undefined, null)).toEqual(false);
    });

    it("returns false if either argument is null with object", () => {
      expect(shallowequal(null, {})).toEqual(false);
      expect(shallowequal({}, null)).toEqual(false);
    });

    it("returns false if either argument is undefined with object", () => {
      expect(shallowequal(undefined, {})).toEqual(false);
      expect(shallowequal({}, undefined)).toEqual(false);
    });
  });

  describe("objects", () => {
    it("returns true for empty objects", () => {
      expect(shallowequal({}, {})).toEqual(true);
    });

    it("returns true if arguments are shallow equal", () => {
      expect(shallowequal({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toEqual(
        true
      );
    });

    it("returns true regardless of key order", () => {
      expect(shallowequal({ a: 1, b: 2 }, { b: 2, a: 1 })).toEqual(true);
    });

    it("returns false if first argument has too many keys", () => {
      expect(shallowequal({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toEqual(false);
    });

    it("returns false if second argument has too many keys", () => {
      expect(shallowequal({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toEqual(false);
    });

    it("returns false if arguments are not shallow equal", () => {
      expect(shallowequal({ a: 1, b: 2, c: {} }, { a: 1, b: 2, c: {} })).toEqual(
        false
      );
    });

    it("returns true if values are not primitives but are ===", () => {
      const obj = {};
      expect(
        shallowequal({ a: 1, b: 2, c: obj }, { a: 1, b: 2, c: obj })
      ).toEqual(true);
    });

    it("returns true for same object reference", () => {
      const obj = { a: 1, b: 2 };
      expect(shallowequal(obj, obj)).toEqual(true);
    });

    it("returns false for objects with different value types", () => {
      expect(shallowequal({ a: 1 }, { a: "1" })).toEqual(false);
      expect(shallowequal({ a: null }, { a: undefined })).toEqual(false);
      expect(shallowequal({ a: 0 }, { a: false })).toEqual(false);
    });

    it("returns true for objects with NaN values", () => {
      expect(shallowequal({ a: NaN }, { a: NaN })).toEqual(true);
    });

    it("returns false for objects with +0 vs -0 values", () => {
      expect(shallowequal({ a: +0 }, { a: -0 })).toEqual(false);
    });

    it("ignores inherited properties", () => {
      const proto = { inherited: true };
      const obj1 = Object.create(proto);
      obj1.own = 1;
      const obj2 = { own: 1 };
      expect(shallowequal(obj1, obj2)).toEqual(true);
    });

    it("ignores non-enumerable properties", () => {
      const obj1: Record<string, unknown> = { a: 1 };
      Object.defineProperty(obj1, "hidden", {
        value: "secret",
        enumerable: false,
      });
      const obj2 = { a: 1 };
      expect(shallowequal(obj1, obj2)).toEqual(true);
    });

    it("does not compare symbol-keyed properties", () => {
      const sym = Symbol("key");
      const obj1 = { a: 1, [sym]: "value1" };
      const obj2 = { a: 1, [sym]: "value2" };
      // Symbol keys are not returned by Object.keys()
      expect(shallowequal(obj1, obj2)).toEqual(true);
    });

    it("treats objects created by Object.create(null) like any other plain object", () => {
      function Foo(this: { a: number }) {
        this.a = 1;
      }
      Foo.prototype.constructor = null;

      const object2 = { a: 1 };
      expect(
        shallowequal(
          new (Foo as unknown as new () => { a: number })(),
          object2
        )
      ).toEqual(true);

      const object1 = Object.create(null) as { a: number };
      object1.a = 1;
      expect(shallowequal(object1, object2)).toEqual(true);
    });

    it("returns false for object with hasOwnProperty as key", () => {
      // Edge case: object has 'hasOwnProperty' as own property
      const obj1 = { hasOwnProperty: 1, a: 2 };
      const obj2 = { hasOwnProperty: 1, a: 2 };
      expect(shallowequal(obj1, obj2)).toEqual(true);

      const obj3 = { hasOwnProperty: 1, a: 2 };
      const obj4 = { hasOwnProperty: 2, a: 2 };
      expect(shallowequal(obj3, obj4)).toEqual(false);
    });
  });

  describe("arrays", () => {
    it("returns true for empty arrays", () => {
      expect(shallowequal([], [])).toEqual(true);
    });

    it("returns true for arrays with same primitive elements", () => {
      expect(shallowequal([1, 2, 3], [1, 2, 3])).toEqual(true);
      expect(shallowequal(["a", "b"], ["a", "b"])).toEqual(true);
    });

    it("returns false for arrays with different elements", () => {
      expect(shallowequal([1, 2, 3], [1, 2, 4])).toEqual(false);
    });

    it("returns false for arrays with different lengths", () => {
      expect(shallowequal([1, 2], [1, 2, 3])).toEqual(false);
      expect(shallowequal([1, 2, 3], [1, 2])).toEqual(false);
    });

    it("returns false for arrays with different order", () => {
      expect(shallowequal([1, 2, 3], [3, 2, 1])).toEqual(false);
    });

    it("returns true for arrays with same object references", () => {
      const obj = { x: 1 };
      expect(shallowequal([obj], [obj])).toEqual(true);
    });

    it("returns false for arrays with different object references", () => {
      expect(shallowequal([{ x: 1 }], [{ x: 1 }])).toEqual(false);
    });

    it("returns true for same array reference", () => {
      const arr = [1, 2, 3];
      expect(shallowequal(arr, arr)).toEqual(true);
    });

    it("handles sparse arrays", () => {
      // eslint-disable-next-line no-sparse-arrays
      const sparse1 = [1, , 3];
      // eslint-disable-next-line no-sparse-arrays
      const sparse2 = [1, , 3];
      expect(shallowequal(sparse1, sparse2)).toEqual(true);
    });

    it("returns true for arrays with NaN elements", () => {
      expect(shallowequal([NaN], [NaN])).toEqual(true);
    });
  });

  describe("mixed types", () => {
    it("returns false if only one argument is not an object", () => {
      expect(shallowequal(1, {})).toEqual(false);
      expect(shallowequal({}, 1)).toEqual(false);
      expect(shallowequal("string", {})).toEqual(false);
      expect(shallowequal({}, "string")).toEqual(false);
    });

    it("returns true for array vs object with same indexed values", () => {
      // Arrays and objects with same numeric keys and values are shallow equal
      // because Object.keys() returns the same keys for both
      expect(shallowequal([1, 2], { 0: 1, 1: 2 })).toEqual(true);
    });

    it("returns false for array vs object with different length", () => {
      // Array has 3 elements, object only has 2 keys
      expect(shallowequal([1, 2, 3], { 0: 1, 1: 2 })).toEqual(false);
    });

    it("returns true for objects with no enumerable keys (Date, RegExp)", () => {
      // Date and RegExp have no enumerable own properties, so they compare as empty objects
      expect(shallowequal(new Date(), {})).toEqual(true);
      expect(shallowequal(/regex/, {})).toEqual(true);
    });

    it("returns true for Date objects with same time (no enumerable props)", () => {
      const time = Date.now();
      // Dates have no enumerable own properties, so two Dates are shallow equal
      expect(shallowequal(new Date(time), new Date(time))).toEqual(true);
    });

    it("returns true for same Date reference", () => {
      const date = new Date();
      expect(shallowequal(date, date)).toEqual(true);
    });

    it("returns true for RegExp objects (no enumerable props)", () => {
      // RegExp has no enumerable own properties
      expect(shallowequal(/test/, /test/)).toEqual(true);
      expect(shallowequal(/test/gi, /different/)).toEqual(true);
    });

    it("returns true for same RegExp reference", () => {
      const regex = /test/;
      expect(shallowequal(regex, regex)).toEqual(true);
    });

    it("returns false for different functions", () => {
      const fn1 = () => {};
      const fn2 = () => {};
      expect(shallowequal(fn1, fn2)).toEqual(false);
    });

    it("returns true for same function reference", () => {
      const fn = () => {};
      expect(shallowequal(fn, fn)).toEqual(true);
    });

    it("returns true for Map objects (no enumerable props)", () => {
      // Map entries are not enumerable own properties
      const map1 = new Map([["a", 1]]);
      const map2 = new Map([["a", 1]]);
      expect(shallowequal(map1, map2)).toEqual(true);

      // Even maps with different entries are "shallow equal"
      const map3 = new Map([["b", 2]]);
      expect(shallowequal(map1, map3)).toEqual(true);
    });

    it("returns true for Set objects (no enumerable props)", () => {
      // Set entries are not enumerable own properties
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([1, 2, 3]);
      expect(shallowequal(set1, set2)).toEqual(true);

      // Even sets with different values are "shallow equal"
      const set3 = new Set([4, 5, 6]);
      expect(shallowequal(set1, set3)).toEqual(true);
    });
  });

  describe("customizer function", () => {
    it("should provide the correct customizer arguments", () => {
      const argsList: unknown[][] = [];
      const arry = [1, 2];
      const object1: Record<string, unknown> = { a: arry, b: null };
      const object2: Record<string, unknown> = { a: arry, b: null };

      object1.b = object2;
      object2.b = object1;

      const expected = [
        [object1, object2],
        [object1.a, object2.a, "a"],
        [object1.b, object2.b, "b"],
      ];

      shallowequal(object1, object2, (...args: unknown[]) => {
        argsList.push(args);
        return undefined;
      });

      expect(argsList).toEqual(expected);
    });

    it("should set the `this` binding", () => {
      const actual = shallowequal(
        "a",
        "b",
        function (this: Record<string, number>, a: string, b: string) {
          return this[a] === this[b];
        },
        { a: 1, b: 1 }
      );

      expect(actual).toEqual(true);
    });

    it("should handle comparisons if customizer returns undefined", () => {
      const noop = () => undefined;

      expect(shallowequal("a", "a", noop)).toEqual(true);
      expect(shallowequal(["a"], ["a"], noop)).toEqual(true);
      expect(shallowequal({ "0": "a" }, { "0": "a" }, noop)).toEqual(true);
    });

    it("should not handle comparisons if customizer returns true", () => {
      const customizer = (value: unknown) => {
        return typeof value === "string" || undefined;
      };

      expect(shallowequal("a", "b", customizer)).toEqual(true);
      expect(shallowequal(["a"], ["b"], customizer)).toEqual(true);
      expect(shallowequal({ "0": "a" }, { "0": "b" }, customizer)).toEqual(
        true
      );
    });

    it("should not handle comparisons if customizer returns false", () => {
      const customizer = (value: unknown) => {
        return typeof value === "string" ? false : undefined;
      };

      expect(shallowequal("a", "a", customizer)).toEqual(false);
      expect(shallowequal(["a"], ["a"], customizer)).toEqual(false);
      expect(shallowequal({ "0": "a" }, { "0": "a" }, customizer)).toEqual(
        false
      );
    });

    it("should return a boolean value even if customizer does not", () => {
      let actual: boolean | boolean[] = shallowequal(
        "a",
        "b",
        () => "c" as unknown as boolean
      );
      expect(actual).toEqual(true);

      const values = falsey.filter((v) => v !== undefined);
      const expected = values.map(() => false);

      actual = [];
      values.forEach((value) => {
        (actual as boolean[]).push(
          shallowequal("a", "a", () => value as unknown as boolean)
        );
      });

      expect(actual).toEqual(expected);
    });

    it("customizer can compare nested objects deeply", () => {
      const deepEqual = (a: unknown, b: unknown): boolean | undefined => {
        if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
          return JSON.stringify(a) === JSON.stringify(b);
        }
        return undefined;
      };

      expect(
        shallowequal({ a: { b: 1 } }, { a: { b: 1 } }, deepEqual)
      ).toEqual(true);
      expect(
        shallowequal({ a: { b: 1 } }, { a: { b: 2 } }, deepEqual)
      ).toEqual(false);
    });

    it("customizer is called for top-level comparison first", () => {
      const calls: string[] = [];
      const customizer = (a: unknown, b: unknown, key?: string) => {
        calls.push(key ?? "root");
        return undefined;
      };

      shallowequal({ a: 1, b: 2 }, { a: 1, b: 2 }, customizer);
      expect(calls).toEqual(["root", "a", "b"]);
    });

    it("customizer returning true at top level short-circuits", () => {
      const calls: string[] = [];
      const customizer = (a: unknown, b: unknown, key?: string) => {
        calls.push(key ?? "root");
        if (key === undefined) return true;
        return undefined;
      };

      const result = shallowequal({ a: 1 }, { a: 2 }, customizer);
      expect(result).toEqual(true);
      expect(calls).toEqual(["root"]);
    });

    it("customizer returning false at top level short-circuits", () => {
      const calls: string[] = [];
      const customizer = (a: unknown, b: unknown, key?: string) => {
        calls.push(key ?? "root");
        if (key === undefined) return false;
        return undefined;
      };

      const result = shallowequal({ a: 1 }, { a: 1 }, customizer);
      expect(result).toEqual(false);
      expect(calls).toEqual(["root"]);
    });

    it("works without compareContext", () => {
      const customizer = (a: unknown, b: unknown) => {
        if (typeof a === "number" && typeof b === "number") {
          return Math.abs(a - b) < 0.01;
        }
        return undefined;
      };

      expect(shallowequal({ a: 1.001 }, { a: 1.002 }, customizer)).toEqual(
        true
      );
      expect(shallowequal({ a: 1.0 }, { a: 2.0 }, customizer)).toEqual(false);
    });
  });

  describe("edge cases", () => {
    it("handles objects with numeric string keys", () => {
      expect(shallowequal({ "0": "a", "1": "b" }, { "0": "a", "1": "b" })).toEqual(true);
      expect(shallowequal({ "0": "a" }, { "1": "a" })).toEqual(false);
    });

    it("handles objects with empty string keys", () => {
      expect(shallowequal({ "": 1 }, { "": 1 })).toEqual(true);
      expect(shallowequal({ "": 1 }, { "": 2 })).toEqual(false);
    });

    it("handles objects with undefined values", () => {
      expect(shallowequal({ a: undefined }, { a: undefined })).toEqual(true);
      expect(shallowequal({ a: undefined }, {})).toEqual(false);
    });

    it("handles objects with null values", () => {
      expect(shallowequal({ a: null }, { a: null })).toEqual(true);
      expect(shallowequal({ a: null }, { a: undefined })).toEqual(false);
    });

    it("handles very long key names", () => {
      const longKey = "a".repeat(10000);
      expect(shallowequal({ [longKey]: 1 }, { [longKey]: 1 })).toEqual(true);
    });

    it("handles objects with many keys", () => {
      const obj1: Record<string, number> = {};
      const obj2: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        obj1[`key${i}`] = i;
        obj2[`key${i}`] = i;
      }
      expect(shallowequal(obj1, obj2)).toEqual(true);

      obj2.key500 = 999;
      expect(shallowequal(obj1, obj2)).toEqual(false);
    });

    it("handles circular references at top level with customizer", () => {
      const obj1: Record<string, unknown> = { a: 1 };
      const obj2: Record<string, unknown> = { a: 1 };
      obj1.self = obj1;
      obj2.self = obj2;

      // Without customizer, this would compare references (which are different)
      expect(shallowequal(obj1, obj2)).toEqual(false);

      // With customizer that ignores 'self' key
      const customizer = (a: unknown, b: unknown, key?: string) => {
        if (key === "self") return true;
        return undefined;
      };
      expect(shallowequal(obj1, obj2, customizer)).toEqual(true);
    });

    it("handles typed arrays (compares indexed values)", () => {
      const arr1 = new Uint8Array([1, 2, 3]);
      const arr2 = new Uint8Array([1, 2, 3]);
      // Typed arrays expose indexed properties, so they can be shallow compared
      expect(shallowequal(arr1, arr2)).toEqual(true);

      const arr3 = new Uint8Array([1, 2, 4]);
      expect(shallowequal(arr1, arr3)).toEqual(false);

      // Same reference
      expect(shallowequal(arr1, arr1)).toEqual(true);
    });

    it("handles ArrayBuffer (no enumerable props)", () => {
      const buf1 = new ArrayBuffer(8);
      const buf2 = new ArrayBuffer(8);
      // ArrayBuffer has no enumerable own properties
      expect(shallowequal(buf1, buf2)).toEqual(true);
      expect(shallowequal(buf1, buf1)).toEqual(true);
    });

    it("handles Error objects (compares enumerable props)", () => {
      const err1 = new Error("test");
      const err2 = new Error("test");
      // Error's message, name, stack are not enumerable by default
      // So two Error objects with same message are shallow equal
      expect(shallowequal(err1, err2)).toEqual(true);
      expect(shallowequal(err1, err1)).toEqual(true);

      // But if we add enumerable properties, they are compared
      const err3 = new Error("test");
      const err4 = new Error("test");
      (err3 as Error & { code: number }).code = 1;
      (err4 as Error & { code: number }).code = 2;
      expect(shallowequal(err3, err4)).toEqual(false);
    });

    it("handles Promise objects (no enumerable props)", () => {
      const p1 = Promise.resolve(1);
      const p2 = Promise.resolve(1);
      // Promises have no enumerable own properties
      expect(shallowequal(p1, p2)).toEqual(true);
      expect(shallowequal(p1, p1)).toEqual(true);
    });

    it("handles WeakMap and WeakSet (no enumerable props)", () => {
      const wm1 = new WeakMap();
      const wm2 = new WeakMap();
      // WeakMap/WeakSet have no enumerable own properties
      expect(shallowequal(wm1, wm2)).toEqual(true);

      const ws1 = new WeakSet();
      const ws2 = new WeakSet();
      expect(shallowequal(ws1, ws2)).toEqual(true);
    });
  });
});
