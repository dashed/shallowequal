# shallowequal

> `shallowequal` is exactly like lodash's `isEqual` but for shallow equal.

`shallowequal(value, other, [customizer], [thisArg])`

Performs a shallow comparison between two given values to determine if they are equivalent. If `customizer` is provided it is invoked to compare values. If `customizer` returns `undefined` (i.e. `void 0`), then comparisons are handled by the `shallowequal` function instead. The `customizer` is bound to `thisArg` and invoked with three arguments: `(value, other, key)`. 

**NOTE:** Docs is (shamelessly) lifted from [lodash's docs](https://lodash.com/docs#isEqual)

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

## License

MIT
