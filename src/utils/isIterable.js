export const isIterable = value => typeof value[Symbol.iterator] === 'function';
