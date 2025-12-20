# shallowequal [![CI](https://github.com/dashed/shallowequal/actions/workflows/ci.yml/badge.svg)](https://github.com/dashed/shallowequal/actions/workflows/ci.yml) [![Downloads](https://img.shields.io/npm/dm/shallowequal.svg)](https://npmjs.com/shallowequal) [![npm version](https://img.shields.io/npm/v/shallowequal.svg?style=flat)](https://www.npmjs.com/package/shallowequal)

> `shallowequal` is like lodash's [`isEqual`](https://lodash.com/docs/3.10.1#isEqual) (v3.10.1) but for shallow (strict) equal.

`shallowequal(value, other, [customizer], [thisArg])`

Performs a **_shallow equality_** comparison between two values (i.e. `value` and `other`) to determine if they are equivalent.

The equality check returns true if `value` and `other` are already strictly equal, OR when all the following are true:

- `value` and `other` are both objects with the same keys
- For each key, the value in `value` and `other` are **strictly equal** (`===`)

If `customizer` (expected to be a function) is provided it is invoked to compare values. If `customizer` returns `undefined` (i.e. `void 0`), then comparisons are handled by the `shallowequal` function instead.

The `customizer` is bound to `thisArg` and invoked with three arguments: `(value, other, key)`.

**NOTE:** Docs are (shamelessly) adapted from [lodash's v3.x docs](https://lodash.com/docs/3.10.1#isEqual)

## Install

```sh
pnpm add shallowequal
# or
npm install shallowequal
# or
yarn add shallowequal
```

## Usage

```js
import shallowequal from "shallowequal";

const object = { user: "fred" };
const other = { user: "fred" };

object == other;
// → false

shallowequal(object, other);
// → true
```

### TypeScript

This package includes TypeScript type definitions:

```ts
import shallowequal, { Comparator } from "shallowequal";

const customCompare: Comparator = (a, b, key) => {
  // Custom comparison logic
  return undefined; // Fall back to default comparison
};

shallowequal({ a: 1 }, { a: 1 }, customCompare);
// → true
```

## Credit

Code for `shallowEqual` originated from https://github.com/gaearon/react-pure-render/ and has since been refactored to have the exact same API as `lodash.isEqualWith` (as of `v4.17.4`).

## Development

Prerequisites:
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)

### Setup

```sh
pnpm install
```

### Commands

Using Make:

```sh
make install    # Install dependencies
make build      # Build the project
make test       # Run tests
make test-watch # Run tests in watch mode
make lint       # Run linter
make typecheck  # Run type checking
make clean      # Clean build artifacts
make ci         # Run full CI pipeline
```

Or using pnpm directly:

```sh
pnpm install    # Install dependencies
pnpm build      # Build the project
pnpm test       # Run tests
pnpm test:watch # Run tests in watch mode
pnpm lint       # Run linter
pnpm typecheck  # Run type checking
```

## License

MIT.
