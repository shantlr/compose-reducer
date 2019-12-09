export const pipe = (firstFunction, ...functions) => {
  if (!firstFunction) {
    return () => undefined;
  }

  if (!functions.length) {
    return firstFunction;
  }

  return (...args) =>
    functions.reduce((value, ft) => ft(value), firstFunction(...args));
};
