
const fetchKeys = require('lodash.keys');

module.exports = function shallowEqual(objA, objB, compare, compareContext) {
    if (objA === objB) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false;
    }

    const keysA = fetchKeys(objA);
    const keysB = fetchKeys(objB);

    const len = keysA.length;
    if (len !== keysB.length) {
        return false;
    }

    compareContext = compareContext || null;

    // Test for A's keys different from B.
    const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    for (let i = 0; i < len; i++) {
        const key = keysA[i];
        if (!bHasOwnProperty(key)) {
            return false;
        }
        const valueA = objA[key];
        const valueB = objB[key];

        const ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
        if(ret === false || ret === void 0 && valueA !== valueB) {
            return false;
        }
    }

    return true;
};
