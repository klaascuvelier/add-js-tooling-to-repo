// Naive merge method, as lodash-es cannot be bundled and dont want to pull in too many/bing external libs
export function merge<T>(object1: T, object2: Partial<T>): T {
  return Object.keys(object2).reduce((acc, key) => {
    const currentValue = object1[key] ?? null;
    const newValue = object2[key];

    if (
      typeof currentValue === 'object' &&
      currentValue !== null &&
      !Array.isArray(currentValue)
    ) {
      acc[key] = merge(currentValue, newValue);
    } else {
      acc[key] = newValue;
    }

    return acc;
  }, object1);
}
