import { ValueResolver } from '../helpers/resolve';
import { get, ValueAtPath, PathElem } from '../utils/get';
import { isFunction } from '../utils/isFunction';

export const fromAction = <State, Action>(
  ...paths: (
    | PathElem
    | PathElem[]
    | ValueResolver<State, Action, PathElem | PathElem[]>
  )[]
): ValueResolver<State, Action, ValueAtPath<Action, typeof paths>> => {
  const isDynamic = paths.some(p => isFunction(p));
  if (isDynamic) {
    const p = [];
    paths.forEach(path => {
      if (isFunction(path)) {
        p.push((state: State, action: Action) => {
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

    const dynamicGetActionResolver = (state: State, action: Action) => {
      const resolvedPath = [];
      p.forEach(r => {
        resolvedPath.push(...r(state, action));
      });

      return get(action, resolvedPath);
    };
    return dynamicGetActionResolver as ValueResolver<
      State,
      Action,
      ValueAtPath<State, typeof paths>
    >;
  }

  const p: PathElem[] = [];
  paths.forEach(path => {
    p.push(...(Array.isArray(path) ? path : path.toString().split('.')));
  });
  const staticGetActionResolver = (state: State, action: Action) =>
    get(action, p);

  return staticGetActionResolver as ValueResolver<
    State,
    Action,
    ValueAtPath<Action, typeof paths>
  >;
};
