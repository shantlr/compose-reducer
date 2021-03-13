import { isNumber } from './isNumber';
import { isString } from './isString';

export const shallowClone = <T>(value: T): T => {
  if (isString(value)) {
    return value;
  }
  if (isNumber(value)) {
    return value;
  }
  if (Array.isArray(value)) {
    // @ts-ignore
    return [...value];
  }

  return { ...value };
};
