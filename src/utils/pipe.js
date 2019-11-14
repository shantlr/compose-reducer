export const pipe = (...functions) => {
  return arg => functions.reduce((value, ft) => ft(value), arg);
};
