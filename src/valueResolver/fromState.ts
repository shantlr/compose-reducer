import { ValueResolver } from '../helpers/resolve';
import { get, ValueAtPath, PathElem } from '../utils/get';
import { isFunction } from '../utils/isFunction';

export const fromState = <State, Action>(
  ...paths: (PathElem | ValueResolver<State, Action, PathElem | PathElem[]>)[]
): ValueResolver<State, Action, ValueAtPath<State, typeof paths>> => {
  const isDynamic = paths.some(p => isFunction(p));

  if (isDynamic) {
    const p: ValueResolver<State, Action, PathElem[]>[] = [];
    paths.forEach(path => {
      if (isFunction(path)) {
        p.push((state: State, action: Action): PathElem[] => {
          const result = path(state, action);
          return Array.isArray(result) ? result : result.toString().split('.');
        });
      } else if (Array.isArray(path)) {
        p.push(() => path);
      } else {
        const splittedPath = path.toString().split('.');
        p.push(() => splittedPath);
      }
    });

    const dynamicGetStateResolver = (state: State, action: Action) => {
      const resolvedPath = [];
      p.forEach(r => {
        resolvedPath.push(...r(state, action));
      });

      return get(state, resolvedPath);
    };
    return dynamicGetStateResolver as ValueResolver<
      State,
      Action,
      ValueAtPath<State, typeof paths>
    >;
  }

  const p = [];
  paths.forEach(path => {
    p.push(...(Array.isArray(path) ? path : path.toString().split('.')));
  });
  const staticGetStateResolver = (state: State, _action: Action) =>
    get(state, p);

  return staticGetStateResolver as ValueResolver<
    State,
    Action,
    ValueAtPath<State, typeof paths>
  >;
};
