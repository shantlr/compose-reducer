import { get } from './get';
import { isNil } from './isNil';
import { last } from './last';
import { initial } from './initial';
import { isRootPath } from './isRootPath';

export const has = (object, path) => {
  if (isRootPath(path)) {
    return true;
  }

  const parent = get(object, initial(path));
  if (isNil(parent)) {
    return false;
  }

  const key = last(path);

  // eslint-disable-next-line no-prototype-builtins
  return parent.hasOwnProperty(key);
};
