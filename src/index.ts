export type Comparator<T = unknown> = (
  a: T,
  b: T,
  key?: string
) => boolean | undefined;

export default function shallowEqual<T>(
  objA: T,
  objB: T,
  compare?: Comparator<T>,
  compareContext?: unknown
): boolean {
  let ret = compare ? compare.call(compareContext, objA, objB) : undefined;

  if (ret !== undefined) {
    return !!ret;
  }

  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    !objA ||
    typeof objB !== "object" ||
    !objB
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  // Test for A's keys different from B.
  for (let idx = 0; idx < keysA.length; idx++) {
    const key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    const valueA = (objA as Record<string, unknown>)[key];
    const valueB = (objB as Record<string, unknown>)[key];

    ret = compare
      ? compare.call(compareContext, valueA as T, valueB as T, key)
      : undefined;

    if (ret === false || (ret === undefined && !Object.is(valueA, valueB))) {
      return false;
    }
  }

  return true;
}
