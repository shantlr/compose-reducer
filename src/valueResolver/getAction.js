import { get } from '../utils/get';
import { isFunction } from '../utils/isFunction';

export const getAction = (...paths) => {
  const isDynamic = paths.some(p => isFunction(p));
  if (isDynamic) {
    const p = [];
    paths.forEach(path => {
      if (isFunction(path)) {
        p.push((state, action) => {
          const result = path(state, action);
          return Array.isArray(result) ? result : result.split('.');
        });
      } else if (Array.isArray(path)) {
        p.push(() => path);
      } else {
        const splittedPath = path.split('.');
        p.push(() => splittedPath);
      }
    });
    const dynamicGetActionResolver = (state, action) => {
      const resolvedPath = [];
      p.forEach(r => {
        resolvedPath.push(...r(state, action));
      });

      return get(action, resolvedPath);
    };
    return dynamicGetActionResolver;
  }

  const p = [];
  paths.forEach(path => {
    p.push(...(Array.isArray(path) ? path : path.split('.')));
  });
  const staticGetActionResolver = (state, action) => get(action, p);
  return staticGetActionResolver;
};
