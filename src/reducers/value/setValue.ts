import { createReducer } from '../../helpers/createReducer';
import {
  wrapPathResolver,
  wrapValueResolver,
  NO_OP,
  StaticOrValueResolverWithContext,
  StaticPathOrPathResolver
} from '../../helpers/resolve';
import { TrackingState } from '../../helpers/trackingState';
import { get, PathElem, ValueAtPath } from '../../utils/get';

export type BaseSetValueHandler<State, Action, Value, OldValue> = (
  trackingState: TrackingState<State, Action>,
  path: PathElem[],
  value: Value,
  oldValue?: OldValue
) => void;

export const setValueBase = <State, Action, Value>(
  pathResolver: StaticPathOrPathResolver<State, Action>,
  valueResolver: StaticOrValueResolverWithContext<State, Action, Value>,
  handleResult: BaseSetValueHandler<
    State,
    Action,
    Value,
    ValueAtPath<State, typeof pathResolver>
  >,
  fnName = 'setValueBase'
) => {
  const resolvePath = wrapPathResolver(pathResolver);
  if (!resolvePath) {
    throw new Error(
      `[${fnName}]: Invalid pathResolver. Expected a string, an array of string or a function but received ${pathResolver}`
    );
  }

  const resolveValue = wrapValueResolver(valueResolver);

  const setValueReducer = (trackingState: TrackingState<State, Action>) => {
    const path = resolvePath(trackingState);
    if (path === NO_OP) {
      return;
    }

    const oldValue = get(trackingState.nextState, path);
    const value = resolveValue(trackingState, { value: oldValue });

    handleResult(trackingState, path, value, oldValue);
  };

  return createReducer(setValueReducer);
};

export const setValue = <State, Action, Value>(
  pathResolver: StaticPathOrPathResolver<State, Action>,
  valueResolver: StaticOrValueResolverWithContext<State, Action, Value>
) => {
  const setValueHandler: BaseSetValueHandler<
    State,
    Action,
    Value,
    ValueAtPath<State, typeof pathResolver>
  > = (trackingState, path, value) => {
    trackingState.updateState(path, value);
  };

  return setValueBase(pathResolver, valueResolver, setValueHandler, 'setValue');
};
