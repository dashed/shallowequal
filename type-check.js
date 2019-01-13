// @flow

import shallowequal from "./index.original.js";

shallowequal("a", "b");
shallowequal();

// $ExpectError
shallowequal("a", "b", false);

// $ExpectError
shallowequal("a", "b", 1);

// $ExpectError
shallowequal("a", "b", "");

shallowequal("a", "b", null);

shallowequal("a", "b", void 0);

// this is legal because function returns void 0
shallowequal("a", "b", () => {});

shallowequal(
  "a",
  "b",
  (): boolean => {
    return true;
  }
);

shallowequal(
  "a",
  "b",
  (x, y, z: ?string): boolean => {
    return true;
  }
);

shallowequal(
  "a",
  "b",
  // $ExpectError
  (x, y, z: ?number): boolean => {
    return true;
  }
);

shallowequal(
  "a",
  "b",
  // $ExpectError
  (): number => {
    return 42;
  }
);
