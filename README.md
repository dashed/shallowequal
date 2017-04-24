# shallowequal [![Build Status](https://travis-ci.org/dashed/shallowequal.svg)](https://travis-ci.org/dashed/shallowequal) [![Downloads](https://img.shields.io/npm/dm/shallowequal.svg)](https://npmjs.com/shallowequal)

> `shallowequal` is like lodash's `isEqual` but for shallow (strict) equal.

`shallowequal(value, other, [customizer], [thisArg])`

Performs equality by iterating through keys on a `value` and returning `false` when any key has values which are not strictly equal between `value` and `other`. Returns `true` when the values of all keys are strictly equal. If `customizer` is provided it is invoked to compare values. If `customizer` returns `undefined` (i.e. `void 0`), then comparisons are handled by the `shallowequal` function instead. The `customizer` is bound to `thisArg` and invoked with three arguments: `(value, other, key)`.

**NOTE:** Docs is (shamelessly) adapted from [lodash's docs](https://lodash.com/docs#isEqual)

## Usage

```
$ npm install --save shallowequal
```

```js
const shallowequal = require('shallowequal');

const object = { 'user': 'fred' };
const other = { 'user': 'fred' };

object == other;
// → false

shallowequal(object, other);
// → true
```

## Credit

Code for `shallowEqual` originated from https://github.com/gaearon/react-pure-render/ and has since been refactored to have the exact same API as `lodash.isEqual`.

## License

MIT
