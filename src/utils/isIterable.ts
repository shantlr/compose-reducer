export const isIterable = (value: any): boolean =>
  typeof value[Symbol.iterator] === 'function';
