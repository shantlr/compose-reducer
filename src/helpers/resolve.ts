import { isString } from '../utils/isString';
import { isFunction } from '../utils/isFunction';
import { isRootPath } from '../utils/isRootPath';
import { get, PathElem } from '../utils/get';
import { isNumber } from '../utils/isNumber';
import { isNil } from '../utils/isNil';
import { Context, TrackingState } from './trackingState';

export const NO_OP = Symbol('no_op: resolved path is nil');
export const resolveNoOp = (): typeof NO_OP => NO_OP;

const resolveRelativePath = <State, Action>(
  trackingState: TrackingState<State, Action>,
  path?: PathElem[]
) => {
  return [...trackingState.getPath(), ...(path || [])];
};

const staticRelativePathResolve = (path: PathElem[]) => {
  const staticRelativePathResolver = <State, Action>(
    trackingState: TrackingState<State, Action>
  ) => resolveRelativePath(trackingState, path);

  return staticRelativePathResolver;
};

export type ValueResolverWithContext<State, Action, Value> = (
  state: State,
  action: Action,
  context: Context<Action>,
  info: Record<string, unknown> & {
    initialState: State;
  }
) => Value;
export type StaticOrValueResolverWithContext<State, Action, Value> =
  | Value
  | ValueResolverWithContext<State, Action, Value>;

export type StaticPathOrPathResolver<
  State,
  Action
> = StaticOrValueResolverWithContext<State, Action, PathElem | PathElem[]>;

export const resolveValueWithContext = <State, Action, Value>(
  resolver: ValueResolverWithContext<State, Action, Value>,
  trackingState: TrackingState<State, Action>,
  additionalMeta?: any
) => {
  return resolver(
    get(trackingState.nextState, resolveRelativePath(trackingState)),
    trackingState.action,
    trackingState.context,
    {
      initialState: trackingState.initialState,
      ...additionalMeta
    }
  );
};

export const wrapPathResolver = <State, Action>(
  pathResolver: StaticPathOrPathResolver<State, Action>
): ((
  trackingState: TrackingState<State, Action>
) => typeof NO_OP | PathElem[]) => {
  if (isNil(pathResolver)) {
    return resolveNoOp;
  }

  // static array path
  if (Array.isArray(pathResolver)) {
    return staticRelativePathResolve(pathResolver);
  }

  if (isRootPath(pathResolver)) {
    return staticRelativePathResolve([]);
  }

  // static string path
  if (isString(pathResolver)) {
    return staticRelativePathResolve(pathResolver.split('.'));
  }

  // static number path
  if (isNumber(pathResolver)) {
    return staticRelativePathResolve([pathResolver]);
  }

  // dynamic resolver
  if (isFunction(pathResolver)) {
    return trackingState => {
      const path = resolveValueWithContext(pathResolver, trackingState);

      if (isNil(path)) {
        return NO_OP;
      }

      if (Array.isArray(path)) {
        return resolveRelativePath(trackingState, path);
      }
      if (isRootPath(path)) {
        return resolveRelativePath(trackingState, []);
      }
      if (isString(path)) {
        return resolveRelativePath(trackingState, path.split('.'));
      }
      if (isNumber(path)) {
        return resolveRelativePath(trackingState, [path]);
      }

      throw new Error(
        `[path-resolver] Resolved path is expected to be a string or an array of string but received ${path}`
      );
    };
  }

  // could not wrap path resolver
  return null;
};

const actionAsValueResolver = <State, Action>(
  trackingState: TrackingState<State, Action>
) => trackingState.action;

export function wrapValueResolver<State, Action>(): (
  trackingState: TrackingState<State, Action>
) => Action;
export function wrapValueResolver<State, Action, Value>(
  valueResolve: StaticOrValueResolverWithContext<State, Action, Value>
): (trackingState: TrackingState<State, Action>, meta?: any) => Value;

export function wrapValueResolver<State, Action, Value>(
  valueResolver?: StaticOrValueResolverWithContext<State, Action, Value>
): (trackingState: TrackingState<State, Action>) => Value | Action {
  if (isFunction(valueResolver)) {
    const dynamicValueResolver = (
      trackingState: TrackingState<State, Action>,
      additionalMeta?: any
    ) => resolveValueWithContext(valueResolver, trackingState, additionalMeta);
    return dynamicValueResolver;
  }
  if (valueResolver === undefined) {
    return actionAsValueResolver;
  }

  const staticValueResolver = () => valueResolver;
  return staticValueResolver;
}

export type ValueResolver<State, Action, Value> = (
  state: State,
  action: Action
) => Value;
export type StaticOrValueResolver<State, Action, Value> =
  | Value
  | ValueResolver<State, Action, Value>;
// export type StaticOrValueResolver<State, Action, Value> = Value extends (
//   ...args: any[]
// ) => infer U
//   ? U
//   : Value;
// | Value
// | ValueResolver<State, Action, Value>;

export const wrapSimpleValueResolver = <State, Action, Value>(
  valueResolver: Value | ValueResolver<State, Action, Value>
): ValueResolver<State, Action, Value> => {
  if (isFunction(valueResolver)) {
    return valueResolver;
  }

  const staticValueResolver = () => valueResolver;
  return staticValueResolver;
};
