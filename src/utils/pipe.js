export const pipe = (firstFunction, ...functions) => {
  if (!firstFunction) {
    return () => undefined;
  }

  return (...args) =>
    functions.reduce((value, ft) => ft(value), firstFunction(...args));
};
