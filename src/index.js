const HOP = Object.prototype.hasOwnProperty;

export default function shallowEqual(objA, objB, compare, compareContext) {

    let ret = compare ? compare.call(compareContext, objA, objB) : undefined;

    if(ret !== undefined) {
        return !!ret;
    }

    if (objA === objB) {
        return true;
    }

    if (typeof objA !== 'object' || !objA ||
        typeof objB !== 'object' || !objB ) {
        return false;
    }

    for (let key in objA) {
        if (!HOP.call(objA, key)) continue;
        if (!HOP.call(objB, key)) return false;
        let valueA = objA[key];
        let valueB = objB[key];

        ret = compare ? compare.call(compareContext, valueA, valueB, key) : undefined;
        if(ret === false || ret === undefined && valueA !== valueB) {
            return false;
        }
    }

    for (let key in objB) {
        if (!HOP.call(objB, key)) continue;
        if (!HOP.call(objA, key)) return false;
    }

    return true;
};
